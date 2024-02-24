import { useBoundedStore } from '@/app/store/boundedStore';
import React from 'react'
import { PiArrowDown, PiArrowUp } from 'react-icons/pi';
import { NumericFormat } from "react-number-format";

function TotalIncomeExpense() {
    const totalIncome = useBoundedStore((state) => state.currentMonthTotalIncome);
    const totalExpense = useBoundedStore((state) => state.currentMonthTotalExpense);

  return (
    <div className="grid grid-rows-2 divide-y-2 h-full">
      <div className="flex items-center gap-x-1">
        <PiArrowDown className="text-3xl text-green-600" />
        <div>
          <p className="">Income</p>
          <p className="text-green-600 text-lg">
            <NumericFormat
              value={totalIncome}
              displayType={"text"}
              thousandSeparator="."
              decimalSeparator=","
              prefix={"Rp"}
            />
          </p>
        </div>
      </div>
      <div className="flex items-center gap-x-1">
        <PiArrowUp className="text-3xl text-red-600" />
        <div>
          <p>Expense</p>
          <p className="text-red-600 text-lg">
            <NumericFormat
              value={totalExpense}
              displayType={"text"}
              thousandSeparator="."
              decimalSeparator=","
              prefix={"Rp"}
            />
          </p>
        </div>
      </div>
    </div>
  );
}

export default TotalIncomeExpense
