import { createContext, useContext, useState, useEffect } from "react";
import { onAuthChange, getCurrentUser } from "../firebase/auth";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 認証状態変化のリスナーを設定
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // クリーンアップ関数
    return unsubscribe;
  }, []);

  // コンテキストで提供する値
  const value = {
    currentUser,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
