import { db } from "@/app/config/firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import moment from "moment";

const mappingTransactions = async (transactions) => {
  const sortedTransactions = transactions.sort((a, b) => b.date - a.date);
  let latestTransactions = []; // 7 transaksi terakhir

  // mapping latest transactions
  latestTransactions = await sortedTransactions.slice(0, 8);
  if (latestTransactions.length < 8) {
    const latestQuery = query(
      collection(db, "transactions"),
      orderBy("date", "desc"),
      limit(8)
    );
    const querySnapshot = (await getDocs(latestQuery)).docs;

    latestTransactions = querySnapshot.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      date: doc.data().date.toDate(),
    }));
  }

  const map = mapping(sortedTransactions);

  return {
    latestTransactions,
    currentWeekTransactionsStatistic : map.currentWeekTransactionsStatistic,
    currentMonthExpenseTransactions : map.currentMonthExpenseTransactions,
    currentMonthTotalIncome : map.currentMonthTotalIncome,
    currentMonthTotalExpense : map.currentMonthTotalExpense,
    currentMonthIncomeByCategory : map.currentMonthIncomeByCategory,
    currentMonthExpenseByCategory : map.currentMonthExpenseByCategory,
  };
}

const mapping = (sortedTransactions) => {
  const startWeek = moment().startOf("week").toDate();
  const endWeek = moment().endOf("week").toDate();

  let currentWeekTransactionsStatistic = []; //transaksi minggu ini
  let currentMonthExpenseTransactions = [];
  let currentMonthTotalIncome = 0; // total keseluruhan
  let currentMonthTotalExpense = 0; // total keseluruhan
  let currentMonthIncomeByCategory = []; // total berdasarkan kategori
  let currentMonthExpenseByCategory = []; // total berdasarkan kategori

  //mapping current week transactions
  const income = ["Income", 0, 0, 0, 0, 0, 0, 0];
  const expense = ["Expense", 0, 0, 0, 0, 0, 0, 0];
  const currentWeekTransactionsMapping = sortedTransactions
    .filter((item) => item.date >= startWeek && item.date <= endWeek)
    .map((transaction) => {
      let dayIndex = moment(transaction.date).isoWeekday();
      //in moment day index start form monday, but we want day index is start from sunday
      if (dayIndex == 7) {
        dayIndex = 1;
      } else {
        dayIndex += 1;
      }
      if (transaction.is_income) {
        income[dayIndex] += transaction.amount;
      }

      if (transaction.is_expense) {
        expense[dayIndex] += transaction.amount;
      }
    });

  currentWeekTransactionsStatistic = { income, expense };

  // mapping current month expense transactions, total income, total expense, total income for each category, total expense for each category
  const startMonth = moment().startOf("month").toDate();
  const endMonth = moment().endOf("month").toDate();
  sortedTransactions.map((transaction) => {
    if (transaction.date >= startMonth && transaction.date <= endMonth) {
      if (transaction.is_income) {
        currentMonthTotalIncome += transaction.amount;

        const existingObject = currentMonthIncomeByCategory.find(
          (obj) => obj.name == transaction.sub_category
        );
        if (existingObject) {
          existingObject.value += transaction.amount;
        } else {
          currentMonthIncomeByCategory.push({
            value: transaction.amount,
            name: transaction.sub_category,
          });
        }
      } else if (transaction.is_expense) {
        currentMonthTotalExpense += transaction.amount;

        const existingObject = currentMonthExpenseByCategory.find(
          (obj) => obj.name == transaction.category
        );

        if (existingObject) {
          existingObject.value += transaction.amount;
        } else {
          currentMonthExpenseByCategory.push({
            value: transaction.amount,
            name: transaction.category,
          });
        }

        currentMonthExpenseTransactions.push(transaction);
      }
    }
  });

  return {
    currentWeekTransactionsStatistic,
    currentMonthExpenseTransactions,
    currentMonthTotalIncome,
    currentMonthTotalExpense,
    currentMonthIncomeByCategory,
    currentMonthExpenseByCategory,
  };
};

export default mappingTransactions;