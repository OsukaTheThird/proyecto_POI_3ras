import { z } from "zod"
import { loginformSchema as formSchema } from "@/lib/zod"
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
import { AuthError, signInWithEmailAndPassword } from "firebase/auth"
import { useAuth } from "reactfire"
import { useLoadingStore } from "@/store/loading-store"

const Login = () => {

  const auth = useAuth();
  const {loading, setLoading} = useLoadingStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try{
      setLoading(true);
      await signInWithEmailAndPassword(auth, values.email, values.password)
    } catch(error)  {
      console.log(error)
      const firebaseError = error as AuthError;

      if (firebaseError.code === "auth/invalid-login-credentials"){
        form.setError("email",{
          type: "manual",
          message: "Credenciales invalidas"
        });
        form.setError("password",{
          type: "manual",
          message: "Credenciales invalidas"
        });
      }
    } finally{
      setLoading(false);
    }
  }

  return (
    <div className="p-5" > 
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Syum</CardTitle>
          <CardDescription>¡Bienvenido! Por favor inicie sesión</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            <Button type="submit" disabled={loading}>Iniciar Sesión</Button>
          </form>
        </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login