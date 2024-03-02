import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
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
import { transactionsByMonthAddAction, transactionsByMonthDeleteAction, transactionsByMonthEditAction } from "../services/transactions/handleSpecificMonthTransactions";

export const transactionsSlice = (set, get) => ({
  transactions: [], // general transactions
  transactionsByMonth: {},

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

  getSpecificMonthTransactions: async (startDate = moment().startOf("month").format("YYYY-MM-DD"), endDate = moment().endOf("month").format("YYYY-MM-DD")) => {
    get().setIsFailed(false);
    try {
      const currentTransactionsByMonth = get().transactionsByMonth;
      const key = moment(startDate).format("YYYYMMDD");
  
      if (key in currentTransactionsByMonth) {
        return;
      }
  
      const transactions = [];
      const transactionsAmount = [];
  
      const q = query(
        collection(db, "transactions"),
        where("date", ">=", moment(startDate).toDate()),
        where("date", "<=", moment(endDate).toDate())
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.map((doc) => {
        const data = {
          ...doc.data(),
          id: doc.id,
          date: doc.data().date.toDate(),
        };
  
        transactions.push(data);
  
        // handle transactions amount
        const existingItem = transactionsAmount.find(
          (i) => i.date == moment(data.date).format("YYYY-MM-DD")
        );
  
        if (existingItem) {
          if (data.is_income) {
            existingItem.income += data.amount;
          } else if (data.is_expense) {
            existingItem.expense += data.amount;
          }
        } else {
          transactionsAmount.push({
            date: moment(data.date).format("YYYY-MM-DD"),
            income: data.is_income ? data.amount : 0,
            expense: data.is_expense ? data.amount : 0,
          });
        }
      });
  
      const transactionObject = {
        transactions: transactions,
        transactionsAmount,
      };
  
      currentTransactionsByMonth[key] = transactionObject;
  
      set({ transactionsByMonth: currentTransactionsByMonth });
    } catch (error) {
      get().setIsFailed(true);
    }
  },

  fetchTransactions: async () => {
    get().setIsFailed(false);
    try {
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

        const mapping = await mappingTransactions(transactions);

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
    } catch (error) {
      get().setIsFailed(true);
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

    const transactions = [
      ...get().transactions,
      { ...newTransactionData, id: docRef.id },
    ];

    const mapping = await mappingTransactions(transactions);
    const transactionsByMonth = transactionsByMonthAddAction(
      get().transactionsByMonth,
      { ...newTransactionData, id: docRef.id }
    );

    set({
      transactions: transactions,
      transactionsByMonth: transactionsByMonth,
      latestTransactions: mapping.latestTransactions,
      currentWeekTransactionsStatistic:
        mapping.currentWeekTransactionsStatistic,
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

    get().recalculateBudget();
  },

  editTransaction: async (id, editedRecord) => {
    let originalTransaction = get().transactions.filter(
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

    if (!originalTransaction.length) {
      const docRef = doc(db, "transactions", id);
      const docSnap = await getDoc(docRef);
      originalTransaction = [
        {
          ...docSnap.data(),
          date: docSnap.data().date.toDate(),
          id: docSnap.id,
        },
      ];
    }

    await updateDoc(doc(db, "transactions", id), editedTransaction);

    const transactions = get().transactions.map((transaction) =>
      transaction.id == id ? { ...editedTransaction, id: id } : transaction
    );

    const mapping = await mappingTransactions(transactions);
    const transactionsByMonth = await transactionsByMonthEditAction(
      get().transactionsByMonth,
      originalTransaction[0],
      { ...editedTransaction, id: id }
    );

    set({
      transactions: transactions,
      transactionsByMonth: transactionsByMonth,
      latestTransactions: mapping.latestTransactions,
      currentWeekTransactionsStatistic:
        mapping.currentWeekTransactionsStatistic,
      specificMonthTransactions: mapping.specificMonthTransactions,
      currentMonthExpenseTransactions: mapping.currentMonthExpenseTransactions,
      currentMonthTotalIncome: mapping.currentMonthTotalIncome,
      currentMonthTotalExpense: mapping.currentMonthTotalExpense,
      currentMonthIncomeByCategory: mapping.currentMonthIncomeByCategory,
      currentMonthExpenseByCategory: mapping.currentMonthExpenseByCategory,
    });

    if (editedTransaction.is_income || editedTransaction.is_expense) {
      get().recalculateBalance(originalTransaction[0], editedTransaction);
    }

    get().recalculateBudget();
  },

  deleteTransaction: async (transaction) => {
    const accountId = transaction.account_id;
    const amount = transaction.amount;
    await deleteDoc(doc(db, "transactions", transaction.id));

    const transactions = get().transactions.filter(
      (trans) => trans.id !== transaction.id
    );

    const mapping = await mappingTransactions(transactions);
    const transactionsByMonth = await transactionsByMonthDeleteAction(
      get().transactionsByMonth,
      transaction
    );

    set({
      transactions: transactions,
      transactionsByMonth: transactionsByMonth,
      latestTransactions: mapping.latestTransactions,
      currentWeekTransactionsStatistic:
        mapping.currentWeekTransactionsStatistic,
      specificMonthTransactions: mapping.specificMonthTransactions,
      currentMonthExpenseTransactions: mapping.currentMonthExpenseTransactions,
      currentMonthTotalIncome: mapping.currentMonthTotalIncome,
      currentMonthTotalExpense: mapping.currentMonthTotalExpense,
      currentMonthIncomeByCategory: mapping.currentMonthIncomeByCategory,
      currentMonthExpenseByCategory: mapping.currentMonthExpenseByCategory,
    });

    if (transaction.is_income) {
      get().subtractBalance({ id: accountId, amount: amount });
    }

    if (transaction.is_expense) {
      get().addBalance({ id: accountId, amount: amount });
    }

    get().recalculateBudget();
  },
});
