import React, { useRef, useState } from 'react';
import {
    initializeApp,
    getApps
} from 'firebase/app';
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    updateDoc,
    getDoc,
    onSnapshot,
    addDoc
} from 'firebase/firestore';
import { useUser } from 'reactfire';
import { useChatStore } from '@/store/chat-store';
import { MdCall, MdCallEnd, MdCallMade, MdCamera } from "react-icons/md";
// --- Firebase Init ---
const firebaseConfig = {
    apiKey: "AIzaSyBrZX70mKiEHqVoaA5mbR45S3316i0d52w",
    authDomain: "aplicacion-chat-559ed.firebaseapp.com",
    projectId: "aplicacion-chat-559ed",
    storageBucket: "aplicacion-chat-559ed.firebasestorage.app",
    messagingSenderId: "578679281148",
    appId: "1:578679281148:web:fe199709b7527a63500e79"
};

if (!getApps().length) {
    initializeApp(firebaseConfig);
}
const firestore = getFirestore();

// --- ICE Servers ---
const servers: RTCConfiguration = {
    iceServers: [
        { urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] },
    ],
    iceCandidatePoolSize: 10,
};

const VideoCall: React.FC = () => {

    const { getChatData } = useChatStore();
    const chatData = getChatData();
    if (!chatData) return null;

    const { data: user } = useUser();

    const webcamVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const callInputRef = useRef<HTMLInputElement>(null);

    const pcRef = useRef<RTCPeerConnection>(new RTCPeerConnection(servers));
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    const [callId, setCallId] = useState('');
    const [callActive, setCallActive] = useState(false);
    const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'disconnected' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);

    // --- Setup webcam and mic ---
    const setupMedia = async () => {
        try {
            setStatus('connecting');
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const remote = new MediaStream();

            setLocalStream(stream);
            setRemoteStream(remote);

            stream.getTracks().forEach(track => pcRef.current.addTrack(track, stream));

            pcRef.current.ontrack = (event) => {
                event.streams[0].getTracks().forEach(track => remote.addTrack(track));
            };

            if (webcamVideoRef.current) webcamVideoRef.current.srcObject = stream;
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remote;

            setStatus('idle');
        } catch (err) {
            setError('Error al acceder a la cámara o micrófono.');
            setStatus('error');
        }
    };

    // --- Create Call (offer) ---
    const createCall = async () => {
        try {
            setStatus('connecting');
            const callDoc = doc(collection(firestore, 'calls'));
            const offerCandidates = collection(callDoc, 'offerCandidates');
            const answerCandidates = collection(callDoc, 'answerCandidates');

            setCallId(callDoc.id);
            if (callInputRef.current) callInputRef.current.value = callDoc.id;

            pcRef.current.onicecandidate = async (event) => {
                if (event.candidate) {
                    await addDoc(offerCandidates, event.candidate.toJSON());
                }
            };

            const offerDescription = await pcRef.current.createOffer();
            await pcRef.current.setLocalDescription(offerDescription);

            await setDoc(callDoc, {
                offer: {
                    type: offerDescription.type,
                    sdp: offerDescription.sdp,
                },
            });

            onSnapshot(callDoc, (snapshot) => {
                const data = snapshot.data();
                if (data?.answer && !pcRef.current.currentRemoteDescription) {
                    pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
                }
            });

            onSnapshot(answerCandidates, (snapshot) => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        const data = change.doc.data();
                        pcRef.current.addIceCandidate(new RTCIceCandidate(data));
                    }
                });
            });

            setCallActive(true);
            setStatus('connected');
        } catch (err) {
            setError('Error creando la llamada.');
            setStatus('error');
        }
    };

    // --- Answer Call ---
    const answerCall = async () => {
        try {
            setStatus('connecting');
            const id = callInputRef.current?.value;
            if (!id) throw new Error('ID de llamada vacío');

            const callDoc = doc(firestore, 'calls', id);
            const answerCandidates = collection(callDoc, 'answerCandidates');
            const offerCandidates = collection(callDoc, 'offerCandidates');

            pcRef.current.onicecandidate = async (event) => {
                if (event.candidate) {
                    await addDoc(answerCandidates, event.candidate.toJSON());
                }
            };

            const callData = (await getDoc(callDoc)).data();
            if (!callData?.offer) throw new Error('No se encontró la oferta');

            await pcRef.current.setRemoteDescription(new RTCSessionDescription(callData.offer));

            const answerDescription = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answerDescription);

            await updateDoc(callDoc, {
                answer: {
                    type: answerDescription.type,
                    sdp: answerDescription.sdp,
                },
            });

            onSnapshot(offerCandidates, (snapshot) => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        const data = change.doc.data();
                        pcRef.current.addIceCandidate(new RTCIceCandidate(data));
                    }
                });
            });

            setCallActive(true);
            setStatus('connected');
        } catch (err: any) {
            setError(err.message || 'Error al responder la llamada.');
            setStatus('error');
        }
    };

    // --- Hang up ---
    const hangUp = () => {
        pcRef.current.close();

        localStream?.getTracks().forEach(track => track.stop());
        remoteStream?.getTracks().forEach(track => track.stop());

        setLocalStream(null);
        setRemoteStream(null);
        setCallActive(false);
        setCallId('');
        setStatus('disconnected');
        setError(null);

        pcRef.current = new RTCPeerConnection(servers);
    };

    return (
        <body className="text-center text-[#2c3e50] my-[80px] mx-[10px]">
            <h2 className='font-semibold text-2xl'>¡Enciende la WebCam!</h2>

            <br />

            <div style={{ marginTop: '1rem' }}>
                {status !== 'idle' && <p><strong>Estado:</strong> {status}</p>}
                {error && <p style={{ color: 'red' }}>⚠️ {error}</p>}
            </div>

            <div className="flex items-center justify-center">

                <span>
                    <h2 className="font-semibold">{user?.displayName || "No name"}</h2>
                    <video className="w-[40vw] h-[30vw] m-8" ref={webcamVideoRef} autoPlay playsInline muted width="300" />
                </span>

                <span>
                    <h2 className="font-semibold">{chatData?.displayName}</h2>
                    <video className="w-[40vw] h-[30vw] m-8" ref={remoteVideoRef} autoPlay playsInline width="300" />
                </span>

            </div>

            <div className='flex justify-evenly'>
                <button className="bg-slate-400 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded" onClick={setupMedia}>
                    <MdCamera />
                    {/* 🎥 */}
                </button>

                <button className="bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={createCall} disabled={!localStream}>
                    <MdCallMade />
                    {/* 📞 */}
                </button>

                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={answerCall} disabled={!localStream}>
                    <MdCall />
                    {/* 📲 */}
                </button>

                <button className="bg-slate-700 hover:bg-slate-950 text-white font-bold py-2 px-4 rounded" onClick={hangUp} disabled={!callActive}>
                    <MdCallEnd />
                    {/* ❌ */}
                </button>
            </div>

            <br />

            <input
                ref={callInputRef}
                placeholder="ID de llamada"
                value={callId}
                onChange={(e) => setCallId(e.target.value)}
                style={{ marginTop: '1rem', width: '100%' }}
            />
        </body>
    );
};

export default VideoCall;
