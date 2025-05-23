// src/hooks/useVideoCall.ts
import { useState, useRef, useEffect } from "react";
import { db } from "@/lib/firebase-config";
import {
    doc,
    setDoc,
    getDoc,
    onSnapshot,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";

const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export function useVideoCall(userId: string, friendId: string) {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);

    const roomId = [userId, friendId].sort().join("_"); // Room único

    async function startCall() {
        peerConnection.current = new RTCPeerConnection(servers);

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        setLocalStream(stream);

        stream.getTracks().forEach((track) =>
            peerConnection.current!.addTrack(track, stream)
        );

        const remoteStream = new MediaStream();
        setRemoteStream(remoteStream);

        peerConnection.current.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
            });
        };

        const roomRef = doc(db, "calls", roomId);

        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                updateDoc(roomRef, {
                    [`candidates.${userId}`]: arrayUnion(event.candidate.toJSON()),
                });
            }
        };

        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        await setDoc(roomRef, {
            offer: {
                type: offer.type,
                sdp: offer.sdp,
            },
            participants: [userId, friendId],
            candidates: {},
        });

        onSnapshot(roomRef, (snapshot) => {
            const data = snapshot.data();
            if (!data) return;

            if (data.answer && !peerConnection.current?.currentRemoteDescription) {
                const answerDesc = new RTCSessionDescription(data.answer);
                peerConnection.current?.setRemoteDescription(answerDesc);
            }

            const friendCandidates = data.candidates?.[friendId] || [];
            friendCandidates.forEach((candidate: RTCIceCandidateInit) => {
                peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
            });
        });
    }

    async function joinCall() {
        peerConnection.current = new RTCPeerConnection(servers);

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        setLocalStream(stream);

        stream.getTracks().forEach((track) =>
            peerConnection.current!.addTrack(track, stream)
        );

        const remoteStream = new MediaStream();
        setRemoteStream(remoteStream);

        peerConnection.current.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
            });
        };

        const roomRef = doc(db, "calls", roomId);
        const roomSnapshot = await getDoc(roomRef);
        if (!roomSnapshot.exists()) {
            alert("La llamada no existe");
            return;
        }

        const roomData = roomSnapshot.data()!;
        const offerDesc = roomData.offer;
        await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(offerDesc)
        );

        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        await updateDoc(roomRef, { answer: { type: answer.type, sdp: answer.sdp } });

        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                updateDoc(roomRef, {
                    [`candidates.${userId}`]: arrayUnion(event.candidate.toJSON()),
                });
            }
        };

        onSnapshot(roomRef, (snapshot) => {
            const data = snapshot.data();
            if (!data) return;

            const callerCandidates = data.candidates?.[friendId] || [];
            callerCandidates.forEach((candidate: RTCIceCandidateInit) => {
                peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
            });
        });
    }

    async function hangUp() {
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }
        localStream?.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
        setRemoteStream(null);

        const roomRef = doc(db, "calls", roomId);
        await setDoc(roomRef, {}, { merge: false }); // Elimina la room
    }


    // Limpieza al desmontar
    useEffect(() => {
        return () => {
            peerConnection.current?.close();
            localStream?.getTracks().forEach((t) => t.stop());
            setLocalStream(null);
            setRemoteStream(null);
        };
    }, []);

    return { localStream, remoteStream, startCall, joinCall, hangUp};
}