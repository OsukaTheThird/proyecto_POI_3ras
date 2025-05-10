import { Button } from "@/components/ui/button";
import { createformSchema } from '@/lib/zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RoomDB } from "@/schemas/firestore-schema";
import { doc, updateDoc, collection, query, where, getDocs, addDoc, arrayUnion, limit } from 'firebase/firestore';
import { useAuth, useFirestore } from 'reactfire';

const GroupCreation = () => {
    const db = useFirestore();
    const auth = useAuth();

    const form = useForm<z.infer<typeof createformSchema>>({
        resolver: zodResolver(createformSchema),
        defaultValues: {
            emails: "",
            groupName: "",
        }
    });

    async function onSubmit(values: z.infer<typeof createformSchema>) {
        try {
            const emails = values.emails.split(',').map(e => e.trim()).filter(e => e);
            const currentUserUid = auth.currentUser!.uid;

            // Validar nombre del grupo
            if (!values.groupName || values.groupName.trim() === "") {
                throw new Error("Debes proporcionar un nombre para el grupo");
            }

            // Buscar usuarios por email
            const userPromises = emails.map(async (email) => {
                if (email === auth.currentUser!.email) {
                    throw new Error("No puedes incluirte a ti mismo");
                }
                const q = query(collection(db, "users"), where("email", "==", email), limit(1));
                const snapshot = await getDocs(q);
                if (snapshot.empty) {
                    throw new Error(`Usuario no encontrado: ${email}`);
                }
                return { uid: snapshot.docs[0].id, email };
            });

            const users = await Promise.all(userPromises);
            const allUserIds = users.map(u => u.uid);

            // Crear la sala de grupo
            const newRoomDB: RoomDB = {
                messages: [],
                users: [currentUserUid, ...allUserIds],
                groupName: values.groupName,
                lastMessage: "",
                timestamp: new Date().toISOString(),
            };

            const roomRef = await addDoc(collection(db, "rooms"), newRoomDB);

            // Agregar la sala a cada usuario
            const updatePromises = [...users, { uid: currentUserUid }].map(async (user) => {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    rooms: arrayUnion({
                        roomid: roomRef.id,
                        lastMessage: "",
                        timestamp: new Date().toISOString(),
                    }),
                });
            });

            await Promise.all(updatePromises);
            form.reset();

        } catch (error) {
            console.error("Error al crear grupo:", error);
            // Aquí podrías mostrar un mensaje de error al usuario
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="groupName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre del Grupo</FormLabel>
                            <FormControl>
                                <Input placeholder="Nombre del grupo" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="emails"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Correos de los miembros (separados por comas)</FormLabel>
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
                <Button type="submit" className="w-full">
                    Crear Grupo
                </Button>
            </form>
        </Form>
    );
};

export default GroupCreation;