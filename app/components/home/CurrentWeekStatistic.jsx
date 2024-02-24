"use client";
import React from "react";
import EChartsReact from "echarts-for-react";
import { useStore } from "zustand";
import { useBoundedStore } from "@/app/store/boundedStore";
import moment from "moment";

function CurrentWeekStatistic() {
  const boundedStore = useStore(useBoundedStore);

  //Get today's date and the start and end dates of the current week
  const startWeek = new Date(moment().startOf("week"));
  const endWeek = new Date(moment().endOf("week"));

  //   console.log(dayIndex);
  const income = ["Income", 0, 0, 0, 0, 0, 0, 0];
  const expense = ["Expense", 0, 0, 0, 0, 0, 0, 0];
  const currWeekTransactions = useBoundedStore(
    (state) => state.transactions
  ).filter(
    (transaction) =>
      transaction.date >= startWeek && transaction.date <= endWeek
  );

  currWeekTransactions?.map((transaction) => {
    let dayIndex = moment(transaction.date).isoWeekday();
    //in moment day index start form monday, but we want day index is start from sunday
    if (dayIndex == 7) {
      dayIndex = 1;
    } else {
      dayIndex += 1;
    }
    if (transaction.is_income) {
      income[dayIndex] += transaction.amount;
    }

    if (transaction.is_expense) {
      expense[dayIndex] += transaction.amount;
    }
  });
  const option = {
    tooltip: {},
    color: ["#16A34A", "#e5323e"],
    dataset: {
      source: [
        ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        income,
        expense,
      ],
    },
    legend: {},
    xAxis: {
      type: "category",
      axisTick: {
        show: false,
      },
    },
    yAxis: {},
    series: [
      {
        type: "bar",
        seriesLayoutBy: "row",
        emphasis: {
          itemStyle: {
            // color: "green",
          },
        },
      },
      {
        type: "bar",
        seriesLayoutBy: "row",
      },
    ],
  };
  return (
    <div className="h-full flex flex-col">
      <div className="px-2 py-2">
        <p className="text-sm font-semibold">Current Week Statistic</p>
      </div>
      <div className="flex-1">
        <EChartsReact className="min-h-full" option={option} />
      </div>
    </div>
  );
}

export default CurrentWeekStatistic;
