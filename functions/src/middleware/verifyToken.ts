import * as admin from "firebase-admin";

interface IVerifyToken {
  token: string;
}

type TVerifyResult = {
  isAuthenticated: boolean;
};
export default async function verifyToken({
  token,
}: IVerifyToken): Promise<TVerifyResult> {
  if (!token || !token.startsWith("Bearer ")) return { isAuthenticated: false };
  const authToken = token.split("Bearer ")[1];
  try {
    await admin.auth().verifyIdToken(authToken);
    return { isAuthenticated: true };
  } catch {
    return { isAuthenticated: false };
  }
}
