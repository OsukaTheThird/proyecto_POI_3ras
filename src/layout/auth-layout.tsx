import Login from "@/components/auth/login"
import Register from "@/components/auth/register"

const AuthLayout = () => {
  return (
    <main className="bg-emerald-400">
        <div className="min-h-screen grid md:grid-cols-2 md:place content-center 
            place-items-center container">
            <Login />
            <Register />
        </div>
    </main>
  )
}

export default AuthLayout