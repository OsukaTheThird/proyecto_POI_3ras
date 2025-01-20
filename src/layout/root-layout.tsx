import ChatLayout from "./chat-layout";
import AuthLayout from "./auth-layout";
const RootLayout = () => {

    const user = true;

    return (
        <div className=""> {user ? (<ChatLayout /> ) : (<AuthLayout />)}
        </div>
    );
};
export default RootLayout;