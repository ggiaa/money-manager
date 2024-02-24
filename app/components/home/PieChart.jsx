import { useBoundedStore } from '@/app/store/boundedStore';
import EChartsReact from "echarts-for-react";
import React, { useState } from 'react'

function PieChart() {
      const [displayedPie, setDisplayedPie] = useState("expense");
      const expenseData = useBoundedStore(
        (state) => state.currentMonthExpenseByCategory
      );
      const incomeData = useBoundedStore(
        (state) => state.currentMonthIncomeByCategory
      );

      const option = {
        tooltip: {
          trigger: "item",
          position: function (pos, params, dom, rect, size) {
            return pos[0] < size.viewSize[0] / 2 ? "left" : "right";
          },
          valueFormatter: (value) =>
            "Rp" + new Intl.NumberFormat("id-ID").format(value),
        },
        series: [
          {
            name: displayedPie == "expense" ? "Expense" : "Income",
            type: "pie",
            radius: ["50%", "90%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 6,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
              // fontSize: 11,
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 18,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: displayedPie == "expense" ? expenseData : incomeData,
          },
        ],
      };

      const pieChange = (type) => {
        if (displayedPie !== type) {
          setDisplayedPie(type);
        }
      };
  return (
    <div className="grid grid-cols-3 h-full w-full">
      <div className="col-span-2 h-full" id="echart-container">
        <EChartsReact option={option} className="max-h-44" />
      </div>
      <div className="flex flex-col justify-center">
        <div
          className="flex items-center gap-x-2 w-fit cursor-pointer"
          onClick={() => pieChange("income")}
        >
          <div
            className={`w-6 h-3 rounded-sm ${
              displayedPie == "income" ? "bg-green-500" : "bg-gray-300"
            }`}
          ></div>
          <p
            className={`${
              displayedPie == "income" ? "text-black" : "text-gray-300"
            }`}
          >
            Income
          </p>
        </div>
        <div
          className="flex items-center gap-x-2 w-fit cursor-pointer"
          onClick={() => pieChange("expense")}
        >
          <div
            className={`w-6 h-3 rounded-sm ${
              displayedPie == "expense" ? "bg-red-500" : "bg-gray-300"
            }`}
          ></div>
          <p
            className={`${
              displayedPie == "expense" ? "text-black" : "text-gray-300"
            }`}
          >
            Expense
          </p>
        </div>
      </div>
    </div>
  );
}

export default PieChart
