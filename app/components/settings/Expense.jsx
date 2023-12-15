import React, { useEffect, useState } from "react";
import { useStore } from "zustand";
import { useBoundedStore } from "@/app/store/boundedStore";
import DinamicIcon from "@/app/utils/DinamicIcon";
import { PiPlusCircleBold } from "react-icons/pi";
import AddEditIncomeExpense from "./AddEditIncomeExpense";

function Expense() {
  const boundedStore = useStore(useBoundedStore);
  const expenseCategories = useBoundedStore((state) => state.expenseCategories);

  const [showModal, setShowModal] = useState(false);
  const [expense, setExpense] = useState("");

  const handleAdd = () => {};

  const handleClick = (expense) => {};

  useEffect(() => {
    boundedStore.getCategories();
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
        {expenseCategories.map((expense, key) => (
          <div
            className="bg-white flex items-center p-3 rounded-lg cursor-pointer"
            onClick={() => handleClick(expense)}
            key={key}
          >
            <div className="rounded-full bg-sky-300 aspect-square flex items-center justify-center p-2 shadow-lg cursor-pointer hover:bg-sky-400 mr-3">
              <DinamicIcon style="text-2xl" iconName={expense.icon_name} />
            </div>
            <p>{expense.category_name}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <AddEditIncomeExpense
          setShowModal={setShowModal}
          item={expense}
          category="expense"
        />
      )}
    </>
  );
}

export default Expense;
