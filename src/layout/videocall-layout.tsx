import { Button } from '@/components/ui/button';
import { MdCall, MdCallEnd, MdCallMade, MdCamera } from "react-icons/md";
import { useAuth, useFirestore, useUser } from 'reactfire';
import { Friend } from '@/store/chat-store';
import { useChatStore } from "@/store/chat-store";
import { useRef } from 'react';
import { Link } from 'react-router-dom';

//Librerias las cuales mover despues 
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDoc,
    onSnapshot,
    addDoc,
    updateDoc,
} from "firebase/firestore";


// Inicializar Firebase const app = initializeApp(firebaseConfig); const firestore = getFirestore(app);

interface FriendsCallProps { chat: Friend; }

// Elementos HTML

const VideocallLayout = () => {


    const db = useFirestore();

    const webcamVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const webcamButtonRef = useRef<HTMLButtonElement>(null);
    const callButtonRef = useRef<HTMLButtonElement>(null);
    const answerButtonRef = useRef<HTMLButtonElement>(null);
    const hangupButtonRef = useRef<HTMLButtonElement>(null);
    const callInputRef = useRef<HTMLInputElement>(null);

    const servers: RTCConfiguration = {
        iceServers: [
            {
                urls: [
                    'stun:stun1.l.google.com:19302',
                    'stun:stun2.l.google.com:19302',
                ],
            },
        ],
        iceCandidatePoolSize: 10,
    };

    const pc = new RTCPeerConnection(servers);
    let localStream: MediaStream | null = null;
    let remoteStream: MediaStream | null = null;

    const { getChatData } = useChatStore();
    const chatData = getChatData();
    if (!chatData) return null;

    const { data: user } = useUser();

    const turnOnWebcam = async () => {
        try {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            remoteStream = new MediaStream();

            // Añadir tracks a la peer connection
            localStream.getTracks().forEach((track) => {
                pc.addTrack(track, localStream!);
            });

            // Recoger tracks remotos
            pc.ontrack = (event) => {
                if (event.track.kind === 'video') {
                    remoteStream.addTrack(event.track);
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream;
                    }
                }
            };
            // Asignar streams a los videos
            if (webcamVideoRef.current) {
                webcamVideoRef.current.srcObject = localStream;
            }
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
            }


            // Habilitar botones
            if (callButtonRef.current) callButtonRef.current.disabled = false;
            if (answerButtonRef.current) answerButtonRef.current.disabled = false;
            if (webcamButtonRef.current) webcamButtonRef.current.disabled = true;
        } catch (err) {
            console.error('Error accediendo a medios:', err);
        }
    }

    const makeCall = async () => {
        try {
            // Crear documento para la llamada
            const callDocRef = doc(collection(db, 'calls'));
            const offerCandidatesRef = collection(callDocRef, 'offerCandidates');
            const answerCandidatesRef = collection(callDocRef, 'answerCandidates');

            // Escuchar ICE candidates del oferente
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    addDoc(offerCandidatesRef, event.candidate.toJSON());
                }
            };

            const offerDescription = await pc.createOffer();
            await pc.setLocalDescription(offerDescription);

            // Modificar la SDP para usar H264
            let sdp = offerDescription.sdp;
            sdp = sdp.replace('VP8', 'H264');
            await pc.setLocalDescription(new RTCSessionDescription({ type: 'offer', sdp }));


            console.log('Creando oferta...');
            // Guardar oferta en Firestore
            await setDoc(callDocRef, {
                offer: {
                    sdp: offerDescription.sdp,
                    type: offerDescription.type,
                },
                callerId: user?.uid,
                calleeId: chatData?.uid,
            });
            console.log('Oferta enviada:', offerDescription);
            
            // Escuchar respuesta del callee
            onSnapshot(callDocRef, (snapshot) => {
                const data = snapshot.data() as { answer?: RTCSessionDescriptionInit };
                if (!pc.currentRemoteDescription && data?.answer) {
                    const answerDesc = new RTCSessionDescription(data.answer);
                    pc.setRemoteDescription(answerDesc);
                }
            });

            // Escuchar ICE candidates del callee
            onSnapshot(answerCandidatesRef, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const data = change.doc.data() as RTCIceCandidateInit;
                        pc.addIceCandidate(new RTCIceCandidate(data));
                    }
                });
            });

            // Habilitar botones
            if (callButtonRef.current) callButtonRef.current.disabled = false;
        } catch (err) {
            console.error('Error creando la llamada:', err);
        }
    };

    const answerCall = async () => {
        try {
            const callId = callInputRef.current?.value;
            if (!callId) {
                // manejar error o salir
                return;
            }
            const callDocRef = doc(db, 'calls', callId);
            const offerCandidatesRef = collection(callDocRef, 'offerCandidates');
            const answerCandidatesRef = collection(callDocRef, 'answerCandidates');

            // Configurar ICE candidate handler para responder
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    addDoc(answerCandidatesRef, event.candidate.toJSON());
                }
            };

            // Obtener datos de la llamada
            const callData = await getDoc(callDocRef);
            const data = callData.data() as { offer: RTCSessionDescriptionInit };

            // Establecer descripción remota
            await pc.setRemoteDescription(new RTCSessionDescription(data.offer));

            // Crear y establecer respuesta
            const answerDescription = await pc.createAnswer();
            await pc.setLocalDescription(answerDescription);

            // Guardar respuesta en Firestore
            await updateDoc(callDocRef, {
                answer: {
                    type: answerDescription.type,
                    sdp: answerDescription.sdp,
                },
            });

            // Escuchar ICE candidates del oferente
            onSnapshot(offerCandidatesRef, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const data = change.doc.data() as RTCIceCandidateInit;
                        pc.addIceCandidate(new RTCIceCandidate(data));
                    }
                });
            });
        } catch (err) {
            console.error('Error al responder la llamada:', err);
        }
    };




    const hangupCall = () => {
        pc.close();

        localStream = null;
        remoteStream = null;

    }

    return (
        <body className="text-center text-[#2c3e50] my-[80px] mx-[10px]">
            <h1 className='font-semibold text-2xl'>¡Enciende tu webcam!</h1>
            <br />
            <div className="flex items-center justify-center" id="videos">
                <span>
                    <h3 className="font-semibold">{user?.displayName || "No name"}</h3>
                    <video className="w-[40vw] h-[30vw] m-8 bg-[#2c3e50]" ref={webcamVideoRef} autoPlay playsInline></video>
                </span>
                <span>
                    <h3 className="font-semibold">{chatData?.displayName}</h3>
                    <video className="w-[40vw] h-[30vw] m-8 bg-[#2c3e50]" ref={remoteVideoRef} autoPlay playsInline></video>
                </span>
            </div>

            <div className='flex justify-evenly'>
                <Button id="webcamButton" onClick={turnOnWebcam} className='bg-slate-400'>
                    <MdCamera />
                </Button>
                <Button id='callButton' onClick={makeCall} className='bg-blue-300'>
                    <MdCallMade />
                </Button>

                <Button id="answerButton" onClick={answerCall} className="bg-green-400">
                    <MdCall />
                </Button>

                <Link to="/" >
                    <Button id="hangupButton" onClick={hangupCall} className="bg-blue-950">
                        <MdCallEnd />
                    </Button>
                </Link>
            </div>
        </body>
    );
}

export default VideocallLayout