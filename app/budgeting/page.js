"use client";
import { useEffect, useState } from "react";
import { PiPlusCircleBold } from "react-icons/pi";
import AddEditBudget from "../components/budgeting/AddEditBudget";
import { useStore } from "zustand";
import { useBoundedStore } from "../store/boundedStore";

function budgeting() {
  const boundedStore = useStore(useBoundedStore);
  const [addEditModalDisplay, setAddEditModalDisplay] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState("");
  const budgets = useBoundedStore((state) => state.budgets);

  const handleEdit = (budget) => {
    setSelectedBudget(budget);
    setAddEditModalDisplay(true);
  };

  const handleAdd = () => {
    setAddEditModalDisplay(true);
    setSelectedBudget("");
  };

  useEffect(() => {
    boundedStore.getBudgets();
  }, []);

  // budget option
  // const option = {
  //   tooltip: {
  //     trigger: "axis",
  //     formatter: "{b0}<br />" + "{c0}K",
  //   },
  //   xAxis: {
  //     type: "category",
  //     boundaryGap: false,
  //     data: [
  //       "01/01/2023",
  //       "02/01/2023",
  //       "03/01/2023",
  //       "04/01/2023",
  //       "05/01/2023",
  //       "06/01/2023",
  //       "07/01/2023",
  //       "08/01/2023",
  //       "09/01/2023",
  //       "10/01/2023",
  //       "11/01/2023",
  //       "12/01/2023",
  //       "13/01/2023",
  //       "14/01/2023",
  //       "15/01/2023",
  //       "16/01/2023",
  //       "17/01/2023",
  //       "18/01/2023",
  //       "19/01/2023",
  //       "20/01/2023",
  //       "21/01/2023",
  //       "22/01/2023",
  //       "23/01/2023",
  //       "24/01/2023",
  //       "25/01/2023",
  //       "26/01/2023",
  //       "27/01/2023",
  //       "28/01/2023",
  //       "29/01/2023",
  //       "30/01/2023",
  //       "31/01/2023",
  //     ],
  //   },
  //   yAxis: {
  //     type: "value",
  //     position: "left",
  //     axisLabel: {
  //       formatter: "{value}k",
  //     },
  //   },
  //   visualMap: {
  //     show: false,
  //     top: 50,
  //     right: 10,
  //     pieces: [
  //       {
  //         gt: 0,
  //         lte: 135,
  //         color: "#08c91b",
  //       },
  //       {
  //         gt: 135,
  //         lte: 150,
  //         color: "#052bed",
  //       },
  //     ],
  //     outOfRange: {
  //       color: "#f20713",
  //     },
  //   },
  //   series: [
  //     {
  //       data: [20, 30, 30, 30, 60, 100, 120, 135, 145, 155, 165, 175, 185],
  //       type: "line",
  //       showSymbol: false,
  //       markLine: {
  //         silent: true,
  //         symbol: "none",
  //         label: {
  //           show: true,
  //           formatter: "Budget Limit",
  //         },
  //         lineStyle: {
  //           color: "#f20713",
  //         },
  //         data: [
  //           {
  //             yAxis: 150,
  //           },
  //         ],
  //       },
  //       tooltip: {
  //         show: false,
  //       },
  //     },
  //     {
  //       data: [20, 30, 30, 30, 60, 100, 120, 135],
  //       markLine: {
  //         silent: true,
  //         symbol: "none",
  //         label: {
  //           show: true,
  //           formatter: "Today",
  //         },
  //         lineStyle: {
  //           color: "#080808",
  //         },
  //         data: [
  //           {
  //             xAxis: "08/01/2023",
  //           },
  //         ],
  //       },
  //       type: "line",
  //       areaStyle: {},
  //       showSymbol: false,
  //     },
  //   ],
  // };

  return (
    <div className="p-2 flex flex-col h-full">
      <div className="mb-3 flex justify-end">
        <button
          onClick={handleAdd}
          className="bg-sky-500 px-4 py-2 text-white rounded-lg flex items-center shadow-md hover:bg-sky-600 hover:scale-105 transition-all"
        >
          <PiPlusCircleBold className="text-2xl mr-2" />
          Add Budget
        </button>
      </div>
      <div className="h-full">
        {budgets.length ? (
          budgets.map((budget) => (
            <div onClick={() => handleEdit(budget)}>teks</div>
          ))
        ) : (
          <div className="flex justify-center items-center h-full text-lg text-slate-600">
            There is no budget yet.
          </div>
        )}
      </div>

      {addEditModalDisplay && (
        <AddEditBudget
          setAddEditModalDisplay={setAddEditModalDisplay}
          budget={selectedBudget}
        />
      )}
    </div>
  );
}

export default budgeting;
