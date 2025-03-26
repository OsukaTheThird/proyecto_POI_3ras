import { Button } from "@/components/ui/button"
import {searchFormSchema as formSchema} from '@/lib/zod'
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
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
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { useFirestore } from 'reactfire'

const FriendSearch = () => {

    const db = useFirestore();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        email: "",
        }
    })

    async function onSubmit(values:z.infer<typeof formSchema>) {
      try{
        const q = query(collection(db, "users"), where ("email", "==", 
          values.email), limit(1));

          const querySnapshot = await getDocs(q);

          const friendDB = querySnapshot.docs[0].data();
          console.log({friendDB});
      }  catch(error){
        console.log(error)
      }
    }
  
    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                    type='email'
                    placeholder="Buscar por correo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className='w-full'
              >
                Buscar
            </Button>
          </form>
        </Form>
      )
}

export default FriendSearch