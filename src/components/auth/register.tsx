import { z } from "zod"
import { registerformSchema as formSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthError, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { useAuth, useStorage } from "reactfire"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

const Register = () => {

  const auth = useAuth();
  const storage = useStorage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
      photoURL: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
     try{
      const {user} = await createUserWithEmailAndPassword(auth, values.email, values.password);
      console.log("usuario creado");

      // 1. Guardar foto de perfil en storage
      const storageRef = ref(storage, "fotoPerfil/" + user.uid + ".jpg")
      await uploadBytes(storageRef, values.photoURL);
 
      // 2. Recuperar la foto de perfil de la base de datos
      const photoURL = await getDownloadURL(storageRef)

      // 3. Mostrar/Actualizar la foto de perfil del usuario
      await updateProfile(user, {
        displayName: values.displayName,
        photoURL
      });

      console.log("Perfil actualizado")
    } catch (error){
      console.log(error);

      const firebaseError = error as AuthError;

      if (firebaseError.code === "auth/email-already-in-use") {
        form.setError("email", {
          type: "manual",
          message: "Correo ya en uso",
        });
        return;
      }
    } 
  }

  return (
    <div className="p-5">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Registro</CardTitle>
          <CardDescription>Por favor rellene el formulario.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="usuario@dominio.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                    type="password" 
                    placeholder="*******" {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar contraseña</FormLabel>
                  <FormControl>
                    <Input
                    type="password" 
                    placeholder="*******" {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photoURL"
              
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Picture</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      placeholder="Foto de perfil"
                      type="file"
                      accept="image/*, application/pdf"
                      onChange={(event) =>
                        onChange(event.target.files && event.target.files[0])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />  
            <Button type="submit">Registrarse</Button>
          </form>
        </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register