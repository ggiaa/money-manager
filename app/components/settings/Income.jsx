import { useBoundedStore } from "@/app/store/boundedStore";
import React, { useEffect, useState } from "react";
import { PiSunglasses } from "react-icons/pi";
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

  useEffect(() => {
    boundedStore.getCategories();
  }, []);

  return (
    <>
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
        <AddEditIncomeExpense setShowModal={setShowModal} item={income} />
      )}
    </>
  );
}

export default Income;
