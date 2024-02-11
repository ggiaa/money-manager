import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import moment from "moment";
import calculateBudget from "../services/budgeting/calculateBudget";
import mappingTransactions from "../services/transactions/mappingTransactions";

export const transactionsSlice = (set, get) => ({
  transactions: [], // general transactions
  monthlyTransactions: [],

  // All item below will be mapping automatically
  latestTransactions: [], // 7 transaksi terakhir
  currentWeekTransactionsStatistic: {}, //transaksi minggu ini
  specificMonthTransactions: [], // transaksi untuk spesifik bulan tertentu
  currentMonthExpenseTransactions: [],
  currentMonthTotalIncome: 0, // total keseluruhan
  currentMonthTotalExpense: 0, // total keseluruhan
  currentMonthIncomeByCategory: [], // total berdasarkan kategori
  currentMonthExpenseByCategory: [], // total berdasarkan kategori
  fetched: false, //flag apakah datanya sudah di fetch atau belum

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
  getMonthlyTransactions: async (startDate, endDate) => {
    const q = query(
      collection(db, "transactions"),
      where("date", ">=", moment(startDate).toDate()),
      where("date", "<=", moment(endDate).toDate())
    );
    const querySnapshot = await getDocs(q);
    const filteredData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      date: doc.data().date.toDate(),
    }));

    set({ monthlyTransactions: filteredData });
  },
  // addTransaction: async (params) => {
  //   const newTransactionData = {
  //     account: params.account,
  //     account_id: params.accountId,
  //     amount: parseInt(params.amount),
  //     category: params.category1,
  //     sub_category: params.category2,
  //     date: new Date(params.date.startDate),
  //     icon: params.icon,
  //     is_expense: params.is_expense,
  //     is_income: params.is_income,
  //     note: params.note,
  //   };

  //   const docRef = await addDoc(
  //     collection(db, "transactions"),
  //     newTransactionData
  //   );

  //   const transactionsData = [
  //     ...get().transactions,
  //     { ...newTransactionData, id: docRef.id },
  //   ].sort((a, b) => {
  //     return b.date - a.date;
  //   });

  //   // console.log(calculateBudget(get().budgets, get().monthlyTransactions));
  //   // set({ budgets: calculateBudget(get().budgets, get().monthlyTransactions) });

  //   set({ transactions: transactionsData });

  //   if (params.is_expense) {
  //     get().subtractBalance({ id: params.accountId, amount: params.amount });
  //     get().getBudgets();
  //   } else if (params.is_income) {
  //     get().addBalance({ id: params.accountId, amount: params.amount });
  //   }
  // },
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
  deleteTransaction: async (transaction) => {
    const accountId = transaction.account_id;
    const amount = transaction.amount;
    await deleteDoc(doc(db, "transactions", transaction.id));
    const updatedTransactions = get().transactions.filter(
      (trans) => trans.id !== transaction.id
    );

    set({ transactions: updatedTransactions });

    if (transaction.is_income) {
      get().subtractBalance({ id: accountId, amount: amount });
    }

    if (transaction.is_expense) {
      get().addBalance({ id: accountId, amount: amount });
    }
  },

  fetchTransactions: async () => {
    if (!get().fetched) {
      const startDate = moment().startOf("month").toDate();

      let querySnapshot = (
        await getDocs(
          query(
            collection(db, "transactions"),
            where("date", ">=", startDate),
            orderBy("date", "desc")
          )
        )
      ).docs;

      if (querySnapshot.length < 8) {
        const latestQuery = query(
          collection(db, "transactions"),
          orderBy("date", "desc"),
          limit(8)
        );
        querySnapshot = (await getDocs(latestQuery)).docs;
      } else {
      }

      const transactions = querySnapshot.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        date: doc.data().date.toDate(),
      }));

      const mapping = mappingTransactions(transactions);

      set({
        transactions: transactions,
        latestTransactions: mapping.latestTransactions,
        currentWeekTransactionsStatistic:
          mapping.currentWeekTransactionsStatistic,
        specificMonthTransactions: mapping.specificMonthTransactions,
        currentMonthExpenseTransactions:
          mapping.currentMonthExpenseTransactions,
        currentMonthTotalIncome: mapping.currentMonthTotalIncome,
        currentMonthTotalExpense: mapping.currentMonthTotalExpense,
        currentMonthIncomeByCategory: mapping.currentMonthIncomeByCategory,
        currentMonthExpenseByCategory: mapping.currentMonthExpenseByCategory,
        fetched: true,
      });
    }
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

    const transactions = [...get().transactions, { ...newTransactionData, id: docRef.id }];
    
    const mapping = mappingTransactions(transactions);

    set({
      transactions: transactions,
      latestTransactions: mapping.latestTransactions,
      currentWeekTransactionsStatistic: mapping.currentWeekTransactionsStatistic,
      specificMonthTransactions: mapping.specificMonthTransactions,
      currentMonthExpenseTransactions: mapping.currentMonthExpenseTransactions,
      currentMonthTotalIncome: mapping.currentMonthTotalIncome,
      currentMonthTotalExpense: mapping.currentMonthTotalExpense,
      currentMonthIncomeByCategory: mapping.currentMonthIncomeByCategory,
      currentMonthExpenseByCategory: mapping.currentMonthExpenseByCategory,
    });

    if (newTransactionData.is_expense) {
      get().subtractBalance({ id: params.accountId, amount: params.amount });
    } else if (params.is_income) {
      get().addBalance({ id: params.accountId, amount: params.amount });
    }
  },
});
