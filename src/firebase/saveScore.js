import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

export async function saveScore(user, newScore) {
  if (!user?.uid || !db) {
    return { saved: false, reason: "not-authenticated" };
  }

  try {
    const docRef = doc(db, "scores", user.uid);
    const existing = await getDoc(docRef);

    if (existing.exists()) {
      const data = existing.data();
      const prevHigh = data.highScore || 0;
      const isNewHigh = newScore > prevHigh;

      const resolvedName =
        user.displayName?.trim() ||
        data.displayName?.trim() ||
        user.email?.split("@")[0] ||
        "Anonymous";

      await setDoc(docRef, {
        displayName: resolvedName,
        email: user.email || data.email || null,
        highScore: isNewHigh ? newScore : prevHigh,
        gamesPlayed: (data.gamesPlayed || 0) + 1,
        lastPlayedAt: serverTimestamp(),
        updatedAt: isNewHigh ? serverTimestamp() : (data.updatedAt || serverTimestamp()),
      });

      return { saved: true, newHighScore: isNewHigh, highScore: isNewHigh ? newScore : prevHigh };
    } else {
      await setDoc(docRef, {
        displayName: user.displayName?.trim() || user.email?.split("@")[0] || "Anonymous",
        email: user.email || null,
        highScore: newScore,
        gamesPlayed: 1,
        lastPlayedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return { saved: true, newHighScore: true, highScore: newScore };
    }
  } catch (err) {
    console.error("saveScore failed:", err);
    const code = err?.code || "";
    if (code.includes("permission-denied") || code.includes("unauthenticated")) {
      return { saved: false, reason: "permission-denied" };
    }
    return { saved: false, reason: "error", error: err };
  }
}
