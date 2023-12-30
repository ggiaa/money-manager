"use client";
import { useState } from "react";
import { PiPlusCircleBold } from "react-icons/pi";
import AddEditBudget from "../components/budgeting/AddEditBudget";

function budgeting() {
  const [addEditModalDisplay, setAddEditModalDisplay] = useState(false);
  const budgets = [];
  return (
    <div className="p-2 flex flex-col h-full">
      <div className="mb-3 flex justify-end">
        <button
          onClick={() => setAddEditModalDisplay(true)}
          className="bg-sky-500 px-4 py-2 text-white rounded-lg flex items-center shadow-md hover:bg-sky-600 hover:scale-105 transition-all"
        >
          <PiPlusCircleBold className="text-2xl mr-2" />
          Add Budget
        </button>
      </div>
      <div className="h-full">
        {budgets.length ? (
          <div>ada</div>
        ) : (
          <div className="flex justify-center items-center h-full text-lg text-slate-600">
            There is no budget yet.
          </div>
        )}
      </div>

      {addEditModalDisplay && (
        <AddEditBudget setAddEditModalDisplay={setAddEditModalDisplay} />
      )}
    </div>
  );
}

export default budgeting;
