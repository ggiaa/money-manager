import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase";

export const accountsSlice = (set) => ({
  accounts: [],
  getAccounts: async () => {
    const q = query(collection(db, "accounts"), orderBy("created_at"));
    const querySnapshot = await getDocs(q);
    const filteredData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    set({ accounts: filteredData });
  },
});
