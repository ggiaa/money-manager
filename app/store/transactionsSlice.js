import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
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
      date: doc.data().date.toDate(),
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
      date: new Date(params.date.startDate),
      icon: params.icon,
      is_expense: params.is_expense,
      is_income: params.is_income,
      note: params.note,
    };

    const docRef = await addDoc(
      collection(db, "transactions"),
      newTransactionData
    );

    const transactionsData = [
      ...get().transactions,
      { ...newTransactionData, id: docRef.id },
    ].sort((a, b) => {
      return b.date - a.date;
    });

    set({ transactions: transactionsData });

    if (params.is_expense) {
      get().subtractBalance({ id: params.accountId, amount: params.amount });
    } else if (params.is_income) {
      get().addBalance({ id: params.accountId, amount: params.amount });
    }
  },
  editTransaction: async (id, editedRecord) => {
    const originalTransaction = get().transactions.filter(
      (trans) => trans.id == id
    );

    const editedTransaction = {
      account: editedRecord.account,
      account_id: editedRecord.accountId,
      amount: parseInt(editedRecord.amount),
      category: editedRecord.category1,
      sub_category: editedRecord.category2,
      date: new Date(editedRecord.date.startDate),
      icon: editedRecord.icon,
      is_expense: editedRecord.is_expense,
      is_income: editedRecord.is_income,
      note: editedRecord.note,
    };

    await updateDoc(doc(db, "transactions", id), editedTransaction);

    const transactionsData = get()
      .transactions.map((transaction) =>
        transaction.id == id ? { ...editedTransaction, id: id } : transaction
      )
      .sort((a, b) => {
        return b.date - a.date;
      });

    set({ transactions: transactionsData });

    if (editedTransaction.is_income || editedTransaction.is_expense) {
      get().recalculateBalance(originalTransaction[0], editedTransaction);
    }
  },
});
