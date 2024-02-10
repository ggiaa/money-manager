import moment from "moment";

const mappingTransactions = (transactions) => {
  const startWeek = moment().startOf("week").toDate();
  const endWeek = moment().endOf("week").toDate();

  let latestTransactions = []; // 7 transaksi terakhir
  let currentWeekTransactionsStatistic = []; //transaksi minggu ini
  let currentMonthExpenseTransactions = [];
  let currentMonthTotalIncome = 0; // total keseluruhan
  let currentMonthTotalExpense = 0; // total keseluruhan
  let currentMonthIncomeByCategory = []; // total berdasarkan kategori
  let currentMonthExpenseByCategory = []; // total berdasarkan kategori

  const sortedTransactions = transactions.sort((a, b) => b.date - a.date);

  // mapping latest transactions
  latestTransactions = sortedTransactions.slice(0, 2);

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
  sortedTransactions.map((transaction) => {
    if (transaction.is_income) {
      currentMonthTotalIncome += transaction.amount;

      const existingObject = currentMonthIncomeByCategory.find((obj) => obj.name == transaction.sub_category);
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

      const existingObject = currentMonthExpenseByCategory.find((obj) => obj.name == transaction.category);

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
  });

  return {
    latestTransactions,
    currentWeekTransactionsStatistic,
    currentMonthExpenseTransactions,
    currentMonthTotalIncome,
    currentMonthTotalExpense,
    currentMonthIncomeByCategory,
    currentMonthExpenseByCategory,
  };
}

const mappingForCurrentWeekStatistic = () =>{}

export default mappingTransactions;