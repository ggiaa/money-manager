import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase";

export const transactionsSlice = (set, get) => ({
  transactions: [],
  addTransaction: async (params) => {
    const newTransactionData = {
      account: params.account,
      account_id: params.accountId,
      amount: parseInt(params.amount),
      category: params.category1,
      sub_category: params.category2,
      date: new Date(params.date.startDate),
      icon: params.icon,
      is_expense: params.is_expense,
      is_income: params.is_income,
      note: params.note,
    };

    await addDoc(collection(db, "transactions"), newTransactionData);

    const transactionsData = [...get().transactions, newTransactionData].sort(
      (a, b) => {
        return new Date(b.date) - new Date(a.date);
      }
    );

    set({ transactions: transactionsData });

    if (params.is_expense) {
      get().subtractBalance({ id: params.accountId, amount: params.amount });
    } else {
      get().addBalance({ id: params.accountId, amount: params.amount });
    }
  },
});
