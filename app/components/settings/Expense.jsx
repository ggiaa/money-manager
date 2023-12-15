import { useBoundedStore } from "@/app/store/boundedStore";
import React, { useEffect } from "react";
import { useStore } from "zustand";
import { PiSunglasses } from "react-icons/pi";

function Expense() {
  const boundedStore = useStore(useBoundedStore);

  const expenseCategories = useBoundedStore((state) => state.expenseCategories);

  // console.log(expenseCategories);

  useEffect(() => {
    boundedStore.getCategories();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      {expenseCategories.map((expense) => (
        <div className="bg-white flex items-center p-3 rounded-lg">
          <div>
            <PiSunglasses className="text-5xl aspect-square bg-sky-300 rounded-full shadow-lg p-2 mr-4" />
          </div>
          <p>Beauty</p>
        </div>
      ))}
    </div>
  );
}

export default Expense;
