
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, serverTimestamp, setDoc, doc, writeBatch, QuerySnapshot, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// 📌 CONFIGURAÇÃO: Bate-Ponto Bot Project
const firebaseConfig = {
  apiKey: "AIzaSyCOjoVvtlyTGuZxqGT_9AhsaRNeiHYqyD4",
  authDomain: "batepontobot.firebaseapp.com",
  projectId: "batepontobot",
  storageBucket: "batepontobot.firebasestorage.app",
  messagingSenderId: "333510124734",
  appId: "1:333510124734:web:1a5de5b0324f37f834aaef",
  measurementId: "G-137CGP323P"
};

export const isFirebaseConfigured = () => {
  return firebaseConfig.projectId && !firebaseConfig.projectId.includes("SEU_PROJETO_ID");
};

let db: any = null;
let auth: any = null;

if (isFirebaseConfigured()) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (e) {
    console.error("Erro ao inicializar Firebase:", e);
  }
}

/**
 * Garante que o utilizador está autenticado (anónimo) para satisfazer regras de segurança.
 * Se as regras do Firestore forem "if request.auth != null", isto é obrigatório.
 */
const ensureAuth = async () => {
  if (!auth) return false;
  if (auth.currentUser) return true;
  try {
    await signInAnonymously(auth);
    return true;
  } catch (e) {
    console.error("Falha na autenticação anónima:", e);
    return false;
  }
};

export { db };

// --- GESTÃO DE MEMBROS NO FIRESTORE ---

export const saveOfficerToFirestore = async (officer: any) => {
  if (!db) return;
  const authenticated = await ensureAuth();
  if (!authenticated) throw new Error("Não foi possível autenticar sessão com a Cloud.");

  try {
    const docRef = doc(db, "membros", officer.id);
    await setDoc(docRef, {
      ...officer,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (e: any) {
    if (e.code === 'permission-denied') {
      throw new Error("Permissão negada no Firestore. Verifique as Regras de Segurança.");
    }
    throw e;
  }
};

export const syncAllToFirestore = async (officers: any[]) => {
  if (!db) return false;
  const authenticated = await ensureAuth();
  if (!authenticated) {
    console.error("Erro de Autenticação: Sessão anónima falhou.");
    return false;
  }

  try {
    const batch = writeBatch(db);
    officers.forEach(off => {
      const docRef = doc(db, "membros", off.id);
      batch.set(docRef, { ...off, updatedAt: serverTimestamp() }, { merge: true });
    });
    await batch.commit();
    return true;
  } catch (e: any) {
    console.error("Erro no Batch Firestore:", e);
    if (e.code === 'permission-denied') {
      return 'PERMISSION_DENIED';
    }
    return false;
  }
};

export const subscribeToOfficers = (callback: (officers: any[]) => void) => {
  if (!db) return () => {};
  return onSnapshot(collection(db, "membros"), 
    (snapshot: QuerySnapshot<DocumentData>) => {
      const data = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(data);
    },
    (error: Error) => {
      console.error("Erro no Listener Firestore:", error);
    }
  );
};
