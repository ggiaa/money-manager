import { useBoundedStore } from "@/app/store/boundedStore";
import React, { useEffect, useState } from "react";
import { PiSunglasses } from "react-icons/pi";
import { useStore } from "zustand";
import AddEditIncomeExpense from "./AddEditIncomeExpense";

function Income() {
  const boundedStore = useStore(useBoundedStore);
  const incomeCategories = useBoundedStore((state) => state.incomeCategories);

  const [showModal, setShowModal] = useState(false);

  console.log(incomeCategories);

  useEffect(() => {
    boundedStore.getCategories();
  }, []);

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {incomeCategories.map((income, key) => (
          <div
            className="bg-white flex items-center p-3 rounded-lg cursor-pointer"
            onClick={() => setShowModal(true)}
            key={key}
          >
            <div>
              <PiSunglasses className="text-5xl aspect-square bg-sky-300 rounded-full shadow-lg p-2 mr-4" />
            </div>
            <p>Beauty</p>
          </div>
        ))}
      </div>

      {showModal && <AddEditIncomeExpense setShowModal={setShowModal} />}
    </>
  );
}

export default Income;
