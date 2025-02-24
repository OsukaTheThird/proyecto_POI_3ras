import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatLayout from "./chat-layout";
import AuthLayout from "./auth-layout";
import List from "./list-layout"; // Importa tu componente de tareas

const RootLayout = () => {
    const user = true;

    return (
        <Router>
            <div>
                {user ? (
                    <Routes>
                        <Route path="/" element={<ChatLayout />} />
                        <Route path="/tareas" element={<List />} />
                    </Routes>
                ) : (
                    <AuthLayout />
                )}
            </div>
        </Router>
    );
};

export default RootLayout;
