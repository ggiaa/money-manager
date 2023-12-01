import { useBoundedStore } from "@/app/store/boundedStore";
import React, { useEffect, useState } from "react";
import { PiCreditCard } from "react-icons/pi";
import { useStore } from "zustand";
import { NumericFormat } from "react-number-format";

function Accounts() {
  const boundedStore = useStore(useBoundedStore);
  const accounts = useBoundedStore((state) => state.accounts);

  console.log(accounts);
  useEffect(() => {
    boundedStore.getAccounts();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {accounts &&
        accounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center bg-slate-50 py-3 px-4 rounded-xl shadow-md"
          >
            <div className="bg-orange-400 rounded-full p-2 mr-4">
              <PiCreditCard className="text-3xl" />
            </div>
            <div className="h-full flex flex-col justify-between">
              <p className="font-semibold">{account.account_name}</p>
              <p className="text-sm">
                <NumericFormat
                  value={account.account_balance}
                  displayType={"text"}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix={"Rp"}
                />
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Accounts;
