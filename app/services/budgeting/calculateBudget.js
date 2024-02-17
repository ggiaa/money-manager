import moment from "moment";

// const calculateBudget = (budgets, transactions) => {
//   const firstDate = moment().startOf("month");
//   const endDate = moment().endOf("month");
//   const currentDate = moment().format("YYYY-MM-DD");
//   const allDates = [];
//   const modifiedBudget = [];

//   //   create all dates
//   let paramsDate = firstDate.clone(); // Create a copy to avoid modifying the original
//   while (paramsDate.isSameOrBefore(endDate)) {
//     allDates.push(paramsDate.format("YYYY-MM-DD"));
//     paramsDate.add(1, "days"); // Move to the next day
//   }

//   budgets.map((budget) => {
//     const budgetAmount = budget.budget_amount;
//     const budgetCategories = budget.budget_categories;
//     const spending = [];
//     const forecast = [];
//     const overflow = [];
//     let spentAmount = 0;
//     let dailyAverage = 0;
//     let dailyRecomended = 0;
//     // const spendingAverage = 0;
//     // const suggestSpendingAverage = 0;

//     // penanda kondisi spending hari sekarang
//     // 1 = normal, 2 = sama dengan budget, 3 = over
//     let spendingFlag = 0;
//     let spendingBudgetFlag = 0;
//     let suggestDaily = 0;
//     let latestForcast = 0
//     console.log();
//     allDates.map((date, index) => {
//       if (moment(date).isSameOrBefore(currentDate)) {
//         // dapatkan semua transaksi yang tanggalnya sesuai date, kategorinya expnese dan kategori transaksinya ada dalam budget kategori
//         const specificTransactions = transactions.filter(
//           (transaction) =>
//             moment(transaction.date).format("YYYY-MM-DD") == date &&
//             transaction.is_expense &&
//             budgetCategories.some((category) => {
//               return (
//                 category.category === transaction.category &&
//                 category.sub_category === transaction.sub_category
//               );
//             })
//         );

//         // console.log(specificTransactions);
//         let spendingLastValue = spending.length
//           ? Number(spending[spending.length - 1])
//           : 0;
//         if (specificTransactions.length) {
//           specificTransactions.map((trans) => {
//             spendingLastValue += trans.amount;
//           });
//         }

//         spending.push(spendingLastValue);
//         forecast.push(null);
//         overflow.push(null);
//       } else {
//         console.log(spendingFlag);
//         const spendingLastValue = spending[spending.length - 1];
//         if (spendingFlag == 0) {
//           if (spendingLastValue < budget.budget_amount) {
//             spendingFlag = 1;
//             forecast[forecast.length - 1] = spending[spending.length - 1];
//           } else {
//             spendingFlag = 2;
//             overflow[overflow.length - 1] = spending[spending.length - 1];
//           }
//           spendingBudgetFlag = spending[spending.length - 1];
//           spentAmount = spending[spending.length - 1];
//         }

//         if (spendingFlag == 1) {
//           let lastForecastValue = forecast[forecast.length - 1];
//           // kalau kondisi normal
//           if (suggestDaily === 0) {
//             const budgetLeft = budget.budget_amount - spendingBudgetFlag;
//             const dayLeft = allDates.length - index;
//             const average = budgetLeft / dayLeft;
//             suggestDaily = average;

//             dailyRecomended = average.toFixed(2);

//             let lastSpendingValue = spending[spending.length - 1];
//             const daySpend = index;
//             const daily = lastSpendingValue / daySpend;
//             dailyAverage = daily.toFixed(2);
//           }

//           const value = Number(lastForecastValue) + Number(dailyAverage);

//           const valueLatestForecaset = latestForcast == 0 ? forecast[forecast.length - 1] : latestForcast;

//           console.log(valueLatestForecaset);
//           console.log(valueLatestForecaset);
//           if (Number(valueLatestForecaset) < budget.budget_amount) {
//             forecast.push(Number(value).toFixed(2));
//             overflow.push(null);
//           } else {
//             if (!overflow[overflow.length - 1]) {
//               latestForcast = forecast[forecast.length - 1];
//               overflow[overflow.length - 1] = latestForcast;
//               forecast.push(null);
//             } else {
//               overflow.push(
//                 Number(
//                   Number(overflow[overflow.length - 1]) + Number(dailyAverage)
//                 ).toFixed(2)
//               );
//               forecast.push(null);
//             }

//             // spendingFlag=2
//           }
//         } else if (spendingFlag == 2) {
//           let lastOverflowValue = overflow[overflow.length - 1];
//           if (suggestDaily === 0) {
//             let lastSpendingValue = spending[spending.length - 1];
//             const daySpend = index;
//             const average = lastSpendingValue / daySpend;
//             suggestDaily = average;
//             dailyAverage = average.toFixed(2);
//           }

//           const value = Number(lastOverflowValue) + Number(dailyAverage);
//           overflow.push(Number(value).toFixed(2));
//         }
//       }
//     });

//     console.log(spending.findIndex((item) => item >= budget.budget_amount));

//     modifiedBudget.push({
//       ...budget,
//       forecast: forecast,
//       spending: spending,
//       overflow: overflow,
//       dailyAverage: dailyAverage,
//       dailyRecomended: dailyRecomended,
//       allDates: allDates,
//       spentAmount: spentAmount,
//     });
//   });

//   return modifiedBudget;
// };

const calculateBudget = (budgets, transactions) => {
  const budgetsData = [];

  // created dates of this month
  const currentMonth = moment().startOf("month");   // Get the current month
  const daysInMonth = currentMonth.daysInMonth();   // Get the number of days in the current month
  const dates = [];                                 // Create an array to store the dates
  for (let i = 0; i < daysInMonth; i++) {
    dates.push(currentMonth.clone().add(i, "days").format("YYYY-MM-DD"));
  }

  budgets.map((budget) => {
    let tempBudget = { ...budget, dates };        //temporary budget that will be push into budgetsData array

    // mapping budget categories
    const categories = [];
    budget.budget_categories.map(item => {
      const { category, sub_category } = item;

      if (!categories[category]) {
        categories[category] = [];
      }

      if (sub_category && !categories[category].includes(sub_category)) {
        categories[category].push(sub_category);
      }
    });


    // mapping jumlah transaksi setiap tanggal
    const transactionsByDate = [];
    let spentAmount = 0;
    transactions.map(transaction => {
      const { is_expense, category, sub_category, amount, date } = transaction;

      if(is_expense && moment(date) <= moment() ){                                    // if transaction is expense and transaction date is before/same as the current date
        if (categories[category] && categories[category].includes(sub_category)) {    // if ada key categories object ada yang sama dengan transaction.category dan transaction.sub_category ada di dalam array categories object tersebut
          
          // jika belum ada key-nya maka buat key nya dan valuenya 0
          if (!transactionsByDate[moment(date).format("YYYY-MM-DD")]) {
              transactionsByDate[moment(date).format("YYYY-MM-DD")] = 0;
          }

          // masukkan amountnya
          transactionsByDate[moment(date).format("YYYY-MM-DD")] += Number(amount);

          // masukkan ke totalTransactions
          if(moment(date) <= moment()){
            spentAmount += Number(amount);
          }
        }
      }
    });

    const { spending, forecast, overflow, dailyAverage, dailyRecomended } =
      mappingTransactionsWithBudget(
        dates,
        transactionsByDate,
        spentAmount,
        budget.budget_amount
      );

    tempBudget = {...tempBudget, spending,forecast,overflow,dailyAverage,dailyRecomended, spentAmount}

    budgetsData.push(tempBudget);
    // console.log(totalTransactionBeforeCurrentDate);
    
    // console.log(transactionsByDate);
  });

  return budgetsData
}

const mappingTransactionsWithBudget = (dates, transactions, spentAmount, budgetAmount) => {
  const spending = [];
  const forecast = [];
  const overflow = [];

  const dailyAverage = spentAmount / Number(moment().format("D"));
  let dailyRecomended = 0;

  let totalSpend = 0;
  dates.map((date, index) => {
    // setting daily recomended
    if (date > moment().format("YYYY-MM-DD") && spentAmount <= budgetAmount && dailyRecomended == 0) {
      dailyRecomended += (budgetAmount - spentAmount) /(dates.length - Number(moment().format("D")));
    }
    
    // mapping
    if(date <= moment().format("YYYY-MM-DD")){
      spending.push(index == 0 ? 0 : spending[index - 1] + (transactions[date] ?? 0));
      forecast.push(null);
      overflow.push(null);
      totalSpend += transactions[date] ?? 0;
    }else if (date >= moment().format("YYYY-MM-DD") && totalSpend <= budgetAmount) {
      // masukkan ke forecast tanggal hari ini, misal tanggal hari ini tanggal 15, maka tanggal 15 ada isinya di forecast dan spending
      if (!forecast[index - 1]) {
        forecast[index-1] = spending[spending.length - 1];
      }
      
      forecast.push(forecast[index-1] + dailyAverage)
      overflow.push(null);
      totalSpend += dailyAverage;
      // masukkan ke forecast
    }else if(totalSpend >= budgetAmount){
      if (!overflow[index - 1]) {
        overflow[index - 1] = overflow[index-1] ?? forecast[forecast.length-1] ?? spending[spending.length-1];
      }
      // const previousValue = overflow[index-1] ?? forecast[forecast.length-1] ?? spending[spending.length-1];
      overflow.push(overflow[index-1] + dailyAverage)
    }    
  })

  console.log(forecast);
  return {spending, forecast, overflow, dailyAverage, dailyRecomended }
}

export default calculateBudget;
