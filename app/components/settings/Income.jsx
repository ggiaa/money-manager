import { useBoundedStore } from "@/app/store/boundedStore";
import React, { useEffect, useState } from "react";
import { PiPlusCircleBold } from "react-icons/pi";
import { useStore } from "zustand";
import AddEditIncomeExpense from "./AddEditIncomeExpense";
import DinamicIcon from "@/app/utils/DinamicIcon";

function Income() {
  const boundedStore = useStore(useBoundedStore);
  const incomeCategories = useBoundedStore((state) => state.incomeCategories);

  const [showModal, setShowModal] = useState(false);
  const [income, setIncome] = useState("");

  const handleClick = (income) => {
    setShowModal(true);
    setIncome(income);
  };

  const handleAdd = () => {
    setIncome("");
    setShowModal(true);
  };

  useEffect(() => {
    try {
      boundedStore.setIsLoading();
      boundedStore.getCategories();
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
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {incomeCategories.map((income, key) => (
          <div
            className="bg-white flex items-center p-3 rounded-lg cursor-pointer"
            onClick={() => handleClick(income)}
            key={key}
          >
            <div className="rounded-full bg-sky-300 aspect-square flex items-center justify-center p-2 shadow-lg cursor-pointer hover:bg-sky-400 mr-3">
              <DinamicIcon style="text-2xl" iconName={income.icon_name} />
            </div>
            <p>{income.category_name}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <AddEditIncomeExpense
          setShowModal={setShowModal}
          item={income}
          category="income"
        />
      )}
    </>
  );
}

export default Income;
