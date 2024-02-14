"use client";
import { NumericFormat } from "react-number-format";
import Calendar from "../components/statistic/Calendar";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { useBoundedStore } from "../store/boundedStore";
import moment from "moment";
import DinamicIcon from "../utils/DinamicIcon";
import { PiTrash, PiNotePencil } from "react-icons/pi";
import AddEditTransaction from "../components/navbar/AddEditTransaction";

function statistic() {
  const boundedStore = useStore(useBoundedStore);
  const [calendarStart, setCalendarStart] = useState();
  const [calendarEnd, setCalendarEnd] = useState();
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
  const [modalOpen, setModalOpen] = useState(false);
  const [editedData, setEditedData] = useState("");

  const transactions = useBoundedStore((state) => state.transactionsByMonth);

  const handleEditTransaction = (transactionData) => {
    setModalOpen(true);
    setEditedData(transactionData);
  };

  const handleDeleteTransaction = (transactionData) => {
    boundedStore.deleteTransaction(transactionData);
  };

  console.log(transactions);

  useEffect(() => {
    if(calendarStart && calendarEnd){
      boundedStore.getSpecificMonthTransactions(calendarStart, calendarEnd);
    }
  }, [calendarStart]);

  return (
    <div className="w-full h-full grid grid-cols-10 gap-x-2">
      <div className="col-span-7 bg-white rounded-lg p-4 flex flex-col shadow-lg">
        <Calendar
          transactionsAmount={
            transactions[calendarStart?.format("YYYYMMDD")]?.transactionsAmount
          }
          setCalendarStart={setCalendarStart}
          setCalendarEnd={setCalendarEnd}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
      <div className="col-span-3">
        <div className="text-sm bg-white shadow-lg p-4 flex flex-col rounded-lg h-full divide-y overflow-auto">
          {transactions[calendarStart?.format("YYYYMMDD")]?.transactions
            .filter(
              (transaction) =>
                moment(transaction.date).format("YYYY-MM-DD") == selectedDate
            )
            .map((transaction, index) => (
              <div
                className="grid grid-cols-12 text-sm hover:bg-slate-100 my-1"
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
                      <DinamicIcon
                        style="text-2xl"
                        iconName={transaction.icon}
                      />
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
                <div className="col-span-4 py-2 text-right group relative overflow-hidden">
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

                  <div className="absolute cursor-pointer group-hover:right-0 transition-all duration-500 transform translate-x-0 ease -right-36 flex items-center h-full top-0">
                    <div
                      className="bg-sky-400 px-4 h-full flex items-center hover:bg-sky-500 hover:text-white"
                      onClick={() => handleEditTransaction(transaction)}
                    >
                      <PiNotePencil className="text-xl" />
                    </div>
                    <div
                      className="bg-red-400 px-4 h-full flex items-center hover:bg-red-500 hover:text-white"
                      onClick={() => handleDeleteTransaction(transaction)}
                    >
                      <PiTrash className="text-xl" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <AddEditTransaction
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        transactionData={editedData}
      />
    </div>
  );
}

export default statistic;
