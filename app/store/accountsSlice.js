import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const accountsSlice = (set, get) => ({
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
  editAccount: async (params) => {
    await updateDoc(doc(db, "accounts", params.accountId), {
      account_name: params.accountName,
      account_balance: params.accountBalance,
    });

    const acc = get().accounts.map((account) => {
      if (account.id == params.accountId) {
        account["account_name"] = params.accountName;
        account["account_balance"] = params.accountBalance;
      }
      return account;
    });

    set({ accounts: acc });
  },
});
