"use client";
import { NumericFormat } from "react-number-format";
import DinamicIcon from "@/app/utils/DinamicIcon";
import React, { useEffect } from "react";
import moment from "moment";
import { useBoundedStore } from "@/app/store/boundedStore";
import { useStore } from "zustand";
import { PiTrash, PiNotePencil } from "react-icons/pi";

function RecentTransactions() {
  const boundedStore = useStore(useBoundedStore);
  const transactions = useBoundedStore((state) => state.transactions).slice(
    0,
    8
  );
  useEffect(() => {
    boundedStore.getTransactions();
  }, []);

  return (
    <div className="h-full overflow-auto mt-1 divide-y-2">
      {transactions.map((transaction) => (
        <div className="grid grid-cols-12 text-sm hover:bg-slate-100 my-1">
          <div className="col-span-8 py-2">
            <div className="items-center flex w-full gap-x-1">
              <div
                className={`${
                  transaction.is_income ? "bg-green-600" : "bg-red-600"
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
              {moment(transaction.date.toDate()).calendar(null, {
                sameDay: "[Today]",
                nextDay: "[Tomorrow]",
                nextWeek: "dddd",
                lastDay: "[Yesterday]",
                lastWeek: "D MMM (ddd)",
                sameElse: "D MMM (ddd)",
              })}
            </p>

            <div className="absolute cursor-pointer group-hover:right-0 transition-all duration-500 transform translate-x-0 ease -right-36 flex items-center h-full top-0">
              <div className="bg-sky-400 px-4 h-full flex items-center hover:bg-sky-500 hover:text-white">
                <PiNotePencil className="text-xl" />
              </div>
              <div className="bg-red-400 px-4 h-full flex items-center hover:bg-red-500 hover:text-white">
                <PiTrash className="text-xl" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecentTransactions;
