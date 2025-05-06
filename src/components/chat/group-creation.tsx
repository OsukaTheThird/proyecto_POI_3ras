import { Button } from "@/components/ui/button"
import { createformSchema} from '@/lib/zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RoomDB, UserRoom } from "@/schemas/firestore-schema";
import { doc, updateDoc, collection, query, where, getDocs, limit, addDoc, arrayUnion } from 'firebase/firestore'
import { useAuth, useFirestore } from 'reactfire'

const GroupCreation = () => {
    const db = useFirestore();
    const auth = useAuth();

    const form = useForm<z.infer<typeof createformSchema>>({
        resolver: zodResolver(createformSchema),
        defaultValues: {
            emails: "",
        }
    })

    async function onSubmit(values: { emails: string }) {
        try {
            const emails = values.emails.split(',').map(e => e.trim()).filter(e => e); // lista de correos
            const currentUserUid = auth.currentUser!.uid;

            // Buscar todos los usuarios por email
            const userPromises = emails.map(async (email) => {
                if (email === auth.currentUser!.email) {
                    throw new Error("No puedes incluirte a ti mismo");
                }
                const q = query(collection(db, "users"), where("email", "==", email), limit(1));
                const snapshot = await getDocs(q);
                if (snapshot.empty) {
                    throw new Error(`Usuario no encontrado: ${email}`);
                }
                const userData = snapshot.docs[0].data();
                return { uid: userData.uid, email };
            });

            const users = await Promise.all(userPromises);

            // Verificar que todos los usuarios sean diferentes y no estén ya en un chat similar si quieres
            const allUserIds = users.map(u => u.uid);
            if (allUserIds.includes(currentUserUid)) {
                throw new Error("El usuario actual no debe estar en la lista");
            }

            // Crear la sala con todos los usuarios
            const newRoomDB: RoomDB = {
                messages: [],
                users: [currentUserUid, ...allUserIds], // incluye al creador
            };

            const roomRef = await addDoc(collection(db, "rooms"), newRoomDB);
            console.log("Sala creada con ID:", roomRef.id);

            // Agregar la sala a cada usuario
            const batchPromises = users.map(async (user) => {
                const userRef = doc(db, "users", user.uid);
                const userRoom: UserRoom = {
                    roomid: roomRef.id,
                    lastMessage: "",
                    timestamp: "",
                    // Puedes agregar info adicional si quieres
                };
                await updateDoc(userRef, {
                    rooms: arrayUnion(userRoom),
                });
            });

            // También agregar la sala al creador
            const currentUserRef = doc(db, "users", currentUserUid);
            const currentUserRoom: UserRoom = {
                roomid: roomRef.id,
                lastMessage: "",
                timestamp: "",
            };
            await updateDoc(currentUserRef, {
                rooms: arrayUnion(currentUserRoom),
            });

            await Promise.all(batchPromises);

            // Opcional: actualizar relaciones de amistad o lo que necesites

            // Resetear formulario
            form.reset();

        } catch (error) {
            console.error(error);
        }
    }

    <FormField
        control={form.control}
        name = "emails"
        render={({ field }) => (
            <FormItem>
                <FormLabel>Ingrese correos separados por comas</FormLabel>
                <FormControl>
                    <Input
                        placeholder="correo1@example.com, correo2@example.com"
                        {...field}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
}

export default GroupCreation;