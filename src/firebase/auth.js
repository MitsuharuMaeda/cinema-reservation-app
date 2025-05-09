import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "./config";

// メールとパスワードでユーザー登録
export const registerWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // ユーザー表示名を設定
    await updateProfile(userCredential.user, { displayName });
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("ユーザー登録エラー:", error);
    return { success: false, error };
  }
};

// メールとパスワードでログイン
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("ログインエラー:", error);
    return { success: false, error };
  }
};

// Googleでログイン
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Googleログインエラー:", error);
    return { success: false, error };
  }
};

// ログアウト
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("ログアウトエラー:", error);
    return { success: false, error };
  }
};

// パスワードリセットメールの送信
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error("パスワードリセットエラー:", error);
    return { success: false, error };
  }
};

// 現在のユーザーを取得
export const getCurrentUser = () => {
  return auth.currentUser;
};

// 認証状態の変化を監視するリスナー
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
