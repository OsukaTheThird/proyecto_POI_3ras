import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatLayout from "./chat-layout";
import AuthLayout from "./auth-layout";
import GroupLayout from "./groups-layout";
import List from "./list-layout"; // Importa tu componente de tareas
import { useSigninCheck } from "reactfire";
import { useLoadingStore } from "@/store/loading-store";
import Store from "./store-layout";
import VideocallLayout from "./videocall-layout";

const RootLayout = () => {
    const { status, data: signInCheckResult} = useSigninCheck();
    const {loading} = useLoadingStore();

    if (status === 'loading'){
        return <span> Cargando</span>
    }
    
    return (
        <Router>
            <div>
                {signInCheckResult.signedIn && !loading? (
                    <Routes>
                        <Route path="/" element={<ChatLayout />} />
                        <Route path="/tareas" element={<List />} />
                        <Route path="/grupos" element={<GroupLayout />} />
                        <Route path="/tienda" element={<Store />} />
                        <Route path="/call" element={<VideocallLayout />} />
                    </Routes>
                ) : (
                    <AuthLayout />
                )}
            </div>
        </Router>
    );
};

export default RootLayout;
