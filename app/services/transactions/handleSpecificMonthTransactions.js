import moment from "moment";

const transactionsByMonthDeleteAction = (transactions, transaction) => {
  return removeTransaction(transactions, transaction);
};

const transactionsByMonthAddAction = (transactions, transaction) => {
  return addTransaction(transactions, transaction);
};

const transactionsByMonthEditAction = (transactions, originalTransaction, editedTransaction) => {
    const updateTransaction = removeTransaction(transactions, originalTransaction);
  return addTransaction(updateTransaction, editedTransaction);
};

const addTransaction = (transactions, transaction) => {
  let transactionsObject =
    transactions[moment(transaction.date).format("YYYYMM") + "01"];

  if (!transactionsObject) {
    return transactions;
  }

  transactionsObject.transactions.push(transaction);

  //get transactionsObject.transactionsAmount that have date as same as the deleted transaction date, then update the income/expense value
  const transactionAmountItem =
    transactionsObject &&
    Object.values(transactionsObject.transactionsAmount).find(
      (item) => item.date == moment(transaction.date).format("YYYY-MM-DD")
    );

  if (transactionAmountItem) {
    if (transaction.is_income) {
        transactionAmountItem.income += transaction.amount;
    } else if (transaction.is_expense) {
        transactionAmountItem.expense += transaction.amount;
    }
  } else {
    transactionsObject.transactionsAmount.push({
      date: moment(transaction.date).format("YYYY-MM-DD"),
      income: transaction.is_income ? transaction.amount : 0,
      expense: transaction.is_expense ? transaction.amount : 0,
    });
  }

  transactions[moment(transaction.date).format("YYYYMM") + "01"] = transactionsObject;

  return transactions;
};

const removeTransaction = (transactions, transaction) => {
  let transactionsObject =
    transactions[moment(transaction.date).format("YYYYMM") + "01"];

  if (!transactionsObject) {
    return transactions;
  }

  // remove delete transaction from transactionsObject.transactions
  transactionsObject.transactions = transactionsObject.transactions.filter(
    (item) => item.id !== transaction.id
  );

  //get transactionsObject.transactionsAmount that have date as same as the deleted transaction date, then update the income/expense value
  const transactionAmountItem =
    transactionsObject &&
    Object.values(transactionsObject.transactionsAmount).find(
      (item) => item.date == moment(transaction.date).format("YYYY-MM-DD")
    );

  if (transaction.is_income) {
    transactionAmountItem.income -= transaction.amount;
  } else if (transaction.is_expense) {
    transactionAmountItem.expense -= transaction.amount;
  }

  transactions[moment(transaction.date).format("YYYYMM") + "01"] =
    transactionsObject;

  return transactions;
};

export {
  transactionsByMonthDeleteAction,
  transactionsByMonthAddAction,
  transactionsByMonthEditAction,
};
