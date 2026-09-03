import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, appleProvider } from "./config";

/**
 * Triggers Google Sign-In popup and returns Firebase ID Token
 */
export const signInWithGoogle = async (): Promise<string> => {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return idToken;
};

/**
 * Triggers Apple Sign-In popup and returns Firebase ID Token
 */
export const signInWithApple = async (): Promise<string> => {
  const result = await signInWithPopup(auth, appleProvider);
  const idToken = await result.user.getIdToken();
  return idToken;
};
