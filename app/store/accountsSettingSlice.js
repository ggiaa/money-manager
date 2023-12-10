import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const accountsSettingSlice = (set, get) => ({
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
  addAccount: async (params) => {
    const newAccount = {
      account_name: params.accountName,
      account_balance: params.accountBalance,
      created_at: new Date(),
    };

    const docRef = await addDoc(collection(db, "accounts"), newAccount);
    set((state) => ({
      accounts: [...state.accounts, { ...newAccount, id: docRef.id }],
    }));
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
  deleteAccount: async ({ accountId }) => {
    await deleteDoc(doc(db, "accounts", accountId));
    const acc = get().accounts.filter((account) => account.id !== accountId);
    set({ accounts: acc });
  },
});
