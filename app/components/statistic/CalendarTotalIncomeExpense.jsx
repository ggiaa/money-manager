import React from 'react'
import { NumericFormat } from "react-number-format";

function CalendarTotalIncomeExpense({transactionsAmount, day}) {

    const val = transactionsAmount && Object.values(transactionsAmount).find(
        (item) => item.date == day
    );

    // console.log(val);
  return (
    <>
      {val && val["income"] != 0 && (
        <div>
          <p className="text-green-500">
            <NumericFormat
              value={val["income"]}
              displayType={"text"}
              thousandSeparator="."
              decimalSeparator=","
              prefix={"Rp"}
            />
          </p>
        </div>
      )}
      {val && val["expense"] != 0 && (
        <div>
          <p className="text-red-500">
            <NumericFormat
              value={val["expense"]}
              displayType={"text"}
              thousandSeparator="."
              decimalSeparator=","
              prefix={"Rp"}
            />
          </p>
        </div>
      )}
    </>
  );
}

export default CalendarTotalIncomeExpense
