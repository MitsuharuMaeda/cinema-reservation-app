import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

// 画像ファイルをアップロードする関数
export const uploadImage = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error("画像アップロードエラー:", error);
    return { success: false, error };
  }
};

// 画像URLを取得する関数
export const getImageUrl = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("画像URL取得エラー:", error);
    return null;
  }
};
