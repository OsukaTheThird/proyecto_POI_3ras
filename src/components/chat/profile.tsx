import { useAuth, useUser } from "reactfire";
import { Button } from "../ui/button";
import { useChatStore } from "@/store/chat-store";
import { useState } from 'react';
import { Input } from '../ui/input';

const Profile = () => {
  const auth = useAuth();
  const { data: user } = useUser();
  const { resetChat, toggleEncryption, isEncrypted } = useChatStore();
  const [isEncrypting, setIsEncrypting] = useState(false);
 const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleClickLogout = async () => {
    resetChat();
    await auth.signOut();
  };

  const handleToggleEncryption = async () => {
    if (!isEncrypted && (!password || !confirmPassword)) {
      setError('Please enter and confirm your password');
      return;
    }
    
    if (!isEncrypted && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsEncrypting(true);
    setError('');
    try {
      await toggleEncryption(password);
      setPassword('');
      setConfirmPassword('');
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <div className="p-4 text-center border-l">
      {user ? (
        <>
          <img
            src={user?.photoURL || "avatar.png"}
            alt=""
            className="rounded-md mb-4 mx-auto w-24 h-24"
          />
          <h2 className="text-xl font-bold text-gray-700 mb-4">Profile</h2>
          <p className="font-semibold">{user?.displayName || "No name"}</p>
          <p className="text-gray-500 mb-4">{user?.email}</p>
          
          {!isEncrypted ? (
        <div className="mb-4">
          <Input
            type="password"
            placeholder="Encryption password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2"
          />
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-2"
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <Button
            className="w-full mb-2"
            onClick={handleToggleEncryption}
            disabled={isEncrypting || !password || !confirmPassword}
          >
            {isEncrypting ? "Setting up encryption..." : "Enable Encryption"}
          </Button>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-sm text-green-600 mb-2">Messages are encrypted</p>
          <Button
            className="w-full mb-2"
            onClick={handleToggleEncryption}
            disabled={isEncrypting}
            variant="destructive"
          >
            {isEncrypting ? "Disabling..." : "Disable Encryption"}
          </Button>
        </div>
      )}
          <Button
            className="w-full"
            onClick={handleClickLogout}
          >
            Logout
          </Button>
        </>
      ) : (
        <p>Loading info user...</p>
      )}
    </div>
  );
};

export default Profile;