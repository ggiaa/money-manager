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

export default function Home() {
  const [displayedPie, setDisplayedPie] = useState("expense");
  const option = {
    tooltip: {
      trigger: "item",
      position: function (pos, params, dom, rect, size) {
        return pos[0] < size.viewSize[0] / 2 ? "left" : "right";
      },
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["50%", "90%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
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
        data: [
          { value: 1048, name: "Search Engine" },
          { value: 735, name: "Direct" },
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "V" },
          { value: 300, name: "Vi" },
          { value: 300, name: "Vid" },
          { value: 300, name: "Vide" },
          { value: 300, name: "Video" },
          { value: 300, name: "Videoa" },
          { value: 300, name: "Videoab" },
        ],
      },
    ],
  };

  const pieChange = (type) => {
    if (displayedPie !== type) {
      setDisplayedPie(type);
    }
  };

  useEffect(() => {
    const myChart = echarts.init(document.getElementById("echart-container"));
    myChart.setOption(option);
    document.getElementById("category-pie").classList.remove("hidden");
  }, []);

  return (
    <div className="h-full grid grid-cols-10 grid-rows-6 gap-x-2">
      <div className="col-span-7 row-span-6 grid grid-cols-12 grid-rows-6 gap-2">
        <div className="col-span-12 row-span-2 bg-white rounded-lg shadow-lg grid grid-cols-8">
          <div className="col-span-3 flex justify-center items-center flex-col border border-l-0 border-y-0 border-r-2">
            <p className="mb-4">Current Balance</p>
            <div>
              <span>Rp</span>
              <span className="text-2xl font-semibold">10.525.500</span>
            </div>
          </div>
          <div className="grid col-span-2 grid-rows-2 divide-y-2 px-4">
            <div className="flex items-center gap-x-1">
              <PiArrowDown className="text-3xl text-green-600" />
              <div>
                <p className="">Income</p>
                <p className="text-green-600 text-lg">
                  <NumericFormat
                    value={2000000}
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
                    value={500000}
                    displayType={"text"}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix={"Rp"}
                  />
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-2 h-full" id="echart-container"></div>
          <div
            id="category-pie"
            className="flex flex-col justify-center hidden"
          >
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
