"use client";
import { NumericFormat } from "react-number-format";
import DinamicIcon from "@/app/utils/DinamicIcon";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useBoundedStore } from "@/app/store/boundedStore";
import { useStore } from "zustand";
import { PiTrash, PiNotePencil } from "react-icons/pi";
import AddEditTransaction from "../navbar/AddEditTransaction";

function RecentTransactions() {
  const boundedStore = useStore(useBoundedStore);
  const transactions = useBoundedStore((state) => state.latestTransactions);

  const [modalOpen, setModalOpen] = useState(false);
  const [editedData, setEditedData] = useState("");

  const handleEditTransaction = (transactionData) => {
    setModalOpen(true);
    setEditedData(transactionData);
  };

  const handleDeleteTransaction = (transactionData) => {
    try {
      boundedStore.setIsLoading();
      boundedStore.deleteTransaction(transactionData);
      boundedStore.setOperationSuccess();
    } catch (error) {
      boundedStore.setOperationFailed();
    }
  };

  return (
    <div className="h-full overflow-auto mt-1 divide-y-2">
      {transactions?.map((transaction, index) => (
        <div
          key={index}
          className="grid grid-cols-12 text-sm hover:bg-slate-100 my-1 group pl-1 cursor-default"
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
                  className="bg-sky-400 hover:bg-sky-500 hover:text-white py-[6px] px-3 rounded"
                  onClick={() => handleEditTransaction(transaction)}
                >
                  <PiNotePencil className="text-xl" />
                </div>
              </div>
              <div className="px-4 h-full flex items-center">
                <div
                  className="bg-red-400 hover:bg-red-500 hover:text-white py-[6px] px-3 rounded"
                  onClick={() => handleDeleteTransaction(transaction)}
                >
                  <PiTrash className="text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <AddEditTransaction
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        transactionData={editedData}
      />
    </div>
  );
}

export default RecentTransactions;
