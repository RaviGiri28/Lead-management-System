import { initializeApp, cert, getApps } from "firebase-admin/app";
import serviceAccount from "../../firebase-service-account.json";

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount as any),
  });
}