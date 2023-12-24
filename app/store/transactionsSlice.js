import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const transactionsSlice = (set, get) => ({
  transactions: [],
  getTransactions: async () => {
    const q = query(collection(db, "transactions"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const filteredData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    set({ transactions: filteredData });
  },
  addTransaction: async (params) => {
    const newTransactionData = {
      account: params.account,
      account_id: params.accountId,
      amount: parseInt(params.amount),
      category: params.category1,
      sub_category: params.category2,
      date: Timestamp.fromDate(params.date.startDate),
      icon: params.icon,
      is_expense: params.is_expense,
      is_income: params.is_income,
      note: params.note,
    };

    await addDoc(collection(db, "transactions"), newTransactionData);

    const transactionsData = [...get().transactions, newTransactionData].sort(
      (a, b) => {
        return b.date - a.date;
      }
    );

    set({ transactions: transactionsData });

    if (params.is_expense) {
      get().subtractBalance({ id: params.accountId, amount: params.amount });
    } else if (params.is_income) {
      get().addBalance({ id: params.accountId, amount: params.amount });
    }
  },
});
