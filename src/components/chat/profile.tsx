import { useAuth, useUser } from "reactfire";
import { Button } from "../ui/button";
import { useChatStore } from "@/store/chat-store";
import { useState } from 'react';
import { Lock, LockOpen, Loader2 } from "lucide-react";

const Profile = () => {
  const auth = useAuth();
  const { data: user } = useUser();
  const { resetChat, toggleEncryption, isEncrypted } = useChatStore();
  const [isEncrypting, setIsEncrypting] = useState(false);

  const handleClickLogout = async () => {
    resetChat();
    await auth.signOut();
  };

  const handleToggleEncryption = async () => {
    setIsEncrypting(true);
    try {
      // Alternar encriptación sin argumentos
      toggleEncryption();
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <div className="p-4 text-center border-l space-y-4">
      {user ? (
        <>
          <img
            src={user?.photoURL || "avatar.png"}
            alt="User profile"
            className="rounded-md mx-auto w-24 h-24 object-cover border-2 border-gray-200"
          />

          <h2 className="text-xl font-bold text-gray-700">Perfil</h2>
          <p className="font-semibold">{user?.displayName || "Usuario sin nombre"}</p>
          <p className="text-gray-500">{user?.email}</p>

          <div className="space-y-3 pt-4 border-t">
            <h3 className="font-medium flex items-center justify-center gap-2">
              {isEncrypted ? (
                <>
                  <Lock className="h-5 w-5 text-green-600" />
                  <span>Chat encriptado</span>
                </>
              ) : (
                <>
                  <LockOpen className="h-5 w-5 text-gray-500" />
                  <span>Chat no encriptado</span>
                </>
              )}
            </h3>

            <Button
              onClick={handleToggleEncryption}
              disabled={isEncrypting}
              variant={isEncrypted ? "destructive" : "default"}
              className="w-full gap-2"
            >
              {isEncrypting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isEncrypted ? "Desactivando..." : "Activando..."}
                </>
              ) : (
                <>
                  {isEncrypted ? (
                    <>
                      <LockOpen className="h-4 w-4" />
                      Desactivar encriptación
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Activar encriptación
                    </>
                  )}
                </>
              )}
            </Button>
          </div>

          <Button
            onClick={handleClickLogout}
            className="w-full mt-6"
            variant="outline"
          >
            Cerrar sesión
          </Button>
        </>
      ) : (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default Profile;