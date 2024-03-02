import React from 'react'
import moment from 'moment';
import DinamicIcon from '@/app/utils/DinamicIcon';
import { NumericFormat } from "react-number-format";
import { PiNotePencil, PiTrash } from 'react-icons/pi';

function TransactionsList({transactions, calendarStart, selectedDate, handleEditTransaction, handleDeleteTransaction}) {
  return (
    <div className="text-sm bg-white shadow-lg p-4 flex flex-col rounded-lg h-full divide-y overflow-auto">
      {transactions[calendarStart?.format("YYYYMMDD")]?.transactions
        .filter(
          (transaction) =>
            moment(transaction.date).format("YYYY-MM-DD") == selectedDate
        )
        .map((transaction, index) => (
          <div
            className="grid grid-cols-12 text-sm hover:bg-slate-100 my-1 group pl-1"
            key={index}
          >
            <div className="col-span-8 py-2">
              <div className="items-center flex w-full gap-x-1">
                <div
                  className={`${
                    transaction.is_income
                      ? "bg-green-600"
                      : transaction.is_expense
                      ? "bg-red-600"
                      : "bg-gray-500"
                  } rounded-full p-2 aspect-square text-white mr-2`}
                >
                  <DinamicIcon style="text-2xl" iconName={transaction.icon} />
                </div>
                <div className="flex-1">
                  <div className="flex">
                    <p className="">{transaction.category}</p>
                    <p className="px-1">{">"}</p>
                    <p className="">{transaction.sub_category}</p>
                  </div>
                  <p className="text-xs mt-1">{transaction.note}</p>
                </div>
              </div>
            </div>
            <div className="col-span-4 py-2 text-right relative overflow-hidden">
              <p className="text-red-500">
                <NumericFormat
                  value={transaction.amount}
                  displayType={"text"}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix={"Rp"}
                />
              </p>
              <p className="text-xs mt-1">
                {moment(transaction.date).calendar(null, {
                  sameDay: "[Today]",
                  nextDay: "[Tomorrow]",
                  nextWeek: "dddd",
                  lastDay: "[Yesterday]",
                  lastWeek: "D MMM (ddd)",
                  sameElse: "D MMM (ddd)",
                })}
              </p>

              <div className="absolute bg-slate-100 cursor-pointer group-hover:right-0 transition-all duration-500 transform translate-x-0 ease -right-36 flex items-center h-full top-0">
                <div className="h-full flex items-center">
                  <div
                    className="bg-sky-400 py-[6px] px-3 hover:bg-sky-500 hover:text-white rounded"
                    onClick={() => handleEditTransaction(transaction)}
                  >
                    <PiNotePencil className="text-xl" />
                  </div>
                </div>
                <div className="px-4 h-full flex items-center">
                  <div
                    className="bg-red-400 px-3 py-[6px] hover:bg-red-500 hover:text-white rounded"
                    onClick={() => handleDeleteTransaction(transaction)}
                  >
                    <PiTrash className="text-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default TransactionsList
