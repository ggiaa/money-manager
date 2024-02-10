"use client";
import Image from "next/image";
import RecentTransactions from "./components/home/RecentTransactions";
import CurrentWeekStatistic from "./components/home/CurrentWeekStatistic";
import { PiArrowDown } from "react-icons/pi";
import { PiArrowUp } from "react-icons/pi";
import { NumericFormat } from "react-number-format";
import EChartsReact from "echarts-for-react";
import { useEffect, useState } from "react";
import * as echarts from "echarts";
import { useStore } from "zustand";
import { useBoundedStore } from "./store/boundedStore";

export default function Home() {
  const boundedStore = useStore(useBoundedStore);

  const [displayedPie, setDisplayedPie] = useState("expense");
  const [pieData, setPieData] = useState([]);
  const expenseData = useBoundedStore(
    (state) => state.currentMonthExpenseByCategory
  ).map((val) => {
    return { value: val.amount, name: val.category };
  });
  const incomeData = useBoundedStore(
    (state) => state.currentMonthIncomeByCategory
  ).map((val) => {
    return { value: val.amount, name: val.category };
  });

  const totalIncome = useBoundedStore((state) => state.currentMonthTotalIncome);
  const totalExpense = useBoundedStore(
    (state) => state.currentMonthTotalExpense
  );
  const totalBalance = useBoundedStore((state) => state.totalBalance);

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

  useEffect(() => {
    let tempData = [];
  }, [displayedPie]);

  useEffect(() => {
    boundedStore.fetchTransactions();

    // const myChart = echarts.init(document.getElementById("echart-container"));
    // myChart.setOption(option);
    // document.getElementById("category-pie").classList.remove("hidden");
  }, []);

  return (
    <div className="h-full grid grid-cols-10 grid-rows-6 gap-x-2">
      <div className="col-span-7 row-span-6 grid grid-cols-12 grid-rows-6 gap-2">
        <div className="col-span-12 row-span-2 bg-white rounded-lg shadow-lg grid grid-cols-8">
          <div className="col-span-3 flex justify-center items-center flex-col border border-l-0 border-y-0 border-r-2">
            <p className="mb-4">Current Balance</p>
            <div>
              <span className="text-2xl font-semibold">
                <NumericFormat
                  value={totalBalance}
                  displayType={"text"}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix={"Rp"}
                />
              </span>
            </div>
          </div>
          <div className="grid col-span-2 grid-rows-2 divide-y-2 px-4">
            <div className="flex items-center gap-x-1">
              <PiArrowDown className="text-3xl text-green-600" />
              <div>
                <p className="">Income</p>
                <p className="text-green-600 text-lg">
                  <NumericFormat
                    value={totalIncome}
                    displayType={"text"}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix={"Rp"}
                  />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-x-1">
              <PiArrowUp className="text-3xl text-red-600" />
              <div>
                <p>Expense</p>
                <p className="text-red-600 text-lg">
                  <NumericFormat
                    value={totalExpense}
                    displayType={"text"}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix={"Rp"}
                  />
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-2 h-full" id="echart-container">
            <EChartsReact option={option} className="max-h-44" />
          </div>
          <div id="category-pie" className="flex flex-col justify-center">
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
        <div className="col-span-12 row-span-4 bg-white rounded-lg shadow-lg">
          <CurrentWeekStatistic />
        </div>
      </div>
      <div className="col-span-3 row-span-6 bg-white rounded-lg shadow-lg p-4 flex flex-col">
        <p>Recent Transactions</p>
        <RecentTransactions />
      </div>
    </div>
  );
}
