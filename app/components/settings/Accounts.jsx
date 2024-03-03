import { useBoundedStore } from "@/app/store/boundedStore";
import React, { useEffect, useState } from "react";
import { PiCreditCard, PiGearSix } from "react-icons/pi";
import { useStore } from "zustand";
import { NumericFormat } from "react-number-format";
import AddEditAccount from "./AddEditAccount";
import { PiPlusCircleBold } from "react-icons/pi";

function Accounts() {
  const boundedStore = useStore(useBoundedStore);
  const accounts = useBoundedStore((state) => state.accounts);
  const [showModal, setShowModal] = useState(false);

  const [editedAccount, setEditedAccount] = useState("");

  const handleEdit = (account) => {
    setShowModal(true);
    setEditedAccount(account);
  };

  const handleAdd = () => {
    setEditedAccount(null);
    setShowModal(true);
  };

  useEffect(() => {
    try {
      boundedStore.setIsLoading();
      boundedStore.getAccounts();
      boundedStore.setOperationSuccess();
    } catch (error) {
      boundedStore.setOperationFailed();
    }
  }, []);

  return (
    <>
      <div className="mb-3 flex justify-end">
        <button
          onClick={handleAdd}
          className="bg-sky-500 px-4 py-2 text-white rounded-lg flex items-center shadow-md hover:bg-sky-600 hover:scale-105 transition-all"
        >
          <PiPlusCircleBold className="text-2xl mr-2" />
          Add Account
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4 clear-both">
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
              <div
                className="ml-auto cursor-pointer"
                onClick={() => handleEdit(account)}
              >
                <PiGearSix className="text-2xl" />
              </div>
            </div>
          ))}
        {/* modal */}
        {showModal && (
          <AddEditAccount setShowModal={setShowModal} account={editedAccount} />
        )}
      </div>
    </>
  );
}

export default Accounts;
