import Login from "@/components/auth/login"
import Register from "@/components/auth/register";
const RootLayout = () => {

    const user = false;

    return (
        <div className="">
            {user ? (
                <h1>Bienvenidos</h1>
            ) : (
                <div className="h-screen bg-emerald-400 grid grid-cols-2
                place content-center place-items-center">
                <Login />
                <Register />
                </div>
            )}
        </div>
    );
};
export default RootLayout;