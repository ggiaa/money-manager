"use client";
import { useEffect, useState } from "react";
import { PiPlusCircleBold } from "react-icons/pi";
import AddEditBudget from "../components/budgeting/AddEditBudget";
import { useStore } from "zustand";
import { useBoundedStore } from "../store/boundedStore";
import calculateBudget from "../services/budgeting/calculateBudget";
import EChartsReact from "echarts-for-react";
import moment, { min } from "moment";
import { NumericFormat } from "react-number-format";
import Progress from "../components/general/Progress";
import { PiWarning } from "react-icons/pi";

function budgeting() {
  const boundedStore = useStore(useBoundedStore);
  const [addEditModalDisplay, setAddEditModalDisplay] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState("");
  const budgets = useBoundedStore((state) => state.budgets);
  const transactions = useBoundedStore((state) => state.transactions);

  console.log(budgets);

  // const budgets = [
  //   {
  //     budget_categories: [
  //       {
  //         sub_category: "Hairdresser",
  //         category: "Beauty",
  //       },
  //       {
  //         category: "Beauty",
  //         sub_category: "Cosmetics",
  //       },
  //       {
  //         category: "Beauty",
  //         sub_category: "Nail",
  //       },
  //       {
  //         category: "Beauty",
  //         sub_category: "Other",
  //       },
  //       {
  //         category: "Car-Bike",
  //         sub_category: "Fuel",
  //       },
  //       {
  //         category: "Car-Bike",
  //         sub_category: "Parking",
  //       },
  //       {
  //         category: "Car-Bike",
  //         sub_category: "Vehicle",
  //       },
  //       {
  //         sub_category: "Loan",
  //         category: "Car-Bike",
  //       },
  //       {
  //         sub_category: "Insurance",
  //         category: "Car-Bike",
  //       },
  //       {
  //         category: "Car-Bike",
  //         sub_category: "Maintanance",
  //       },
  //       {
  //         sub_category: "Tax",
  //         category: "Car-Bike",
  //       },
  //       {
  //         sub_category: "Other",
  //         category: "Car-Bike",
  //       },
  //     ],
  //     budget_amount: "200000",
  //     budget_name: "budget 2",
  //     created_date: {
  //       seconds: 1705120212,
  //       nanoseconds: 618000000,
  //     },
  //     id: "R7EPfZVzwhsUSOGmqVIx",
  //     forecast: [
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       65000,
  //       "72941.18",
  //       "80882.36",
  //       "88823.54",
  //       "96764.72",
  //       "104705.90",
  //       "112647.08",
  //       "120588.26",
  //       "128529.44",
  //       "136470.62",
  //       "144411.80",
  //       "152352.98",
  //       "160294.16",
  //       "168235.34",
  //       "176176.52",
  //       "184117.70",
  //       "192058.88",
  //       "200000.06",
  //     ],
  //     spending: [0, 0, 0, 0, 0, 0, 0, 0, 0, 50000, 50000, 50000, 65000, 65000],
  //     overflow: [
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //     ],
  //     allDates: [
  //       "2024-01-01",
  //       "2024-01-02",
  //       "2024-01-03",
  //       "2024-01-04",
  //       "2024-01-05",
  //       "2024-01-06",
  //       "2024-01-07",
  //       "2024-01-08",
  //       "2024-01-09",
  //       "2024-01-10",
  //       "2024-01-11",
  //       "2024-01-12",
  //       "2024-01-13",
  //       "2024-01-14",
  //       "2024-01-15",
  //       "2024-01-16",
  //       "2024-01-17",
  //       "2024-01-18",
  //       "2024-01-19",
  //       "2024-01-20",
  //       "2024-01-21",
  //       "2024-01-22",
  //       "2024-01-23",
  //       "2024-01-24",
  //       "2024-01-25",
  //       "2024-01-26",
  //       "2024-01-27",
  //       "2024-01-28",
  //       "2024-01-29",
  //       "2024-01-30",
  //       "2024-01-31",
  //     ],
  //   },
  //   {
  //     budget_amount: "50000",
  //     budget_name: "budget 1",
  //     created_date: {
  //       seconds: 1705072670,
  //       nanoseconds: 769000000,
  //     },
  //     budget_categories: [
  //       {
  //         category: "Beauty",
  //         sub_category: "Cosmetics",
  //       },
  //       {
  //         sub_category: "Nail",
  //         category: "Beauty",
  //       },
  //       {
  //         sub_category: "Fuel",
  //         category: "Car-Bike",
  //       },
  //       {
  //         sub_category: "Parking",
  //         category: "Car-Bike",
  //       },
  //       {
  //         category: "Car-Bike",
  //         sub_category: "Vehicle",
  //       },
  //       {
  //         category: "Car-Bike",
  //         sub_category: "Loan",
  //       },
  //       {
  //         category: "Car-Bike",
  //         sub_category: "Insurance",
  //       },
  //       {
  //         category: "Car-Bike",
  //         sub_category: "Maintanance",
  //       },
  //       {
  //         sub_category: "Tax",
  //         category: "Car-Bike",
  //       },
  //       {
  //         sub_category: "Other",
  //         category: "Car-Bike",
  //       },
  //     ],
  //     id: "1CS8PKznfk1HV4lOuYq0",
  //     forecast: [
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //     ],
  //     spending: [0, 0, 0, 0, 0, 0, 0, 0, 0, 50000, 50000, 50000, 65000, 65000],
  //     overflow: [
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       65000,
  //       "70000.00",
  //       "75000.00",
  //       "80000.00",
  //       "85000.00",
  //       "90000.00",
  //       "95000.00",
  //       "100000.00",
  //       "105000.00",
  //       "110000.00",
  //       "115000.00",
  //       "120000.00",
  //       "125000.00",
  //       "130000.00",
  //       "135000.00",
  //       "140000.00",
  //       "145000.00",
  //       "150000.00",
  //     ],
  //     allDates: [
  //       "2024-01-01",
  //       "2024-01-02",
  //       "2024-01-03",
  //       "2024-01-04",
  //       "2024-01-05",
  //       "2024-01-06",
  //       "2024-01-07",
  //       "2024-01-08",
  //       "2024-01-09",
  //       "2024-01-10",
  //       "2024-01-11",
  //       "2024-01-12",
  //       "2024-01-13",
  //       "2024-01-14",
  //       "2024-01-15",
  //       "2024-01-16",
  //       "2024-01-17",
  //       "2024-01-18",
  //       "2024-01-19",
  //       "2024-01-20",
  //       "2024-01-21",
  //       "2024-01-22",
  //       "2024-01-23",
  //       "2024-01-24",
  //       "2024-01-25",
  //       "2024-01-26",
  //       "2024-01-27",
  //       "2024-01-28",
  //       "2024-01-29",
  //       "2024-01-30",
  //       "2024-01-31",
  //     ],
  //   },
  // ];
  const handleEdit = (budget) => {
    setSelectedBudget(budget);
    setAddEditModalDisplay(true);
  };

  const handleAdd = () => {
    setAddEditModalDisplay(true);
    setSelectedBudget("");
  };

  useEffect(() => {
    try {
      boundedStore.setIsLoading();
      boundedStore.getBudgets();
      boundedStore.setOperationSuccess();
    } catch (error) {
      boundedStore.setOperationFailed();
    }
  }, []);

  return (
    <div className="p-2 flex flex-col h-full">
      <div className="mb-3 flex justify-end relative">
        <div className="absolute -z-10 flex flex-col items-center text-center left-0 w-full h-full">
          <div className="my-auto text-2xl font-semibold">
            {moment().format("MMMM, YYYY")}
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="bg-sky-500 px-4 py-2 text-white rounded-lg flex items-center shadow-md hover:bg-sky-600 hover:scale-105 transition-all"
        >
          <PiPlusCircleBold className="text-2xl mr-2" />
          Add Budget
        </button>
      </div>
      <div className="h-full overflow-auto">
        {budgets.length ? (
          <div className="overflow-auto flex flex-col w-2/3 gap-x-4 gap-y-8 mx-auto">
            {budgets.map((budget, i) => (
              <div
                key={i}
                onClick={() => handleEdit(budget)}
                className="bg-white rounded-lg shadow-lg flex flex-col w-full"
              >
                <div className="px-6 pt-4">
                  <Progress
                    part={budget.spentAmount}
                    whole={budget.budget_amount}
                    budget={budget.budget_amount}
                  />
                </div>
                {(Number(budget.spentAmount) > Number(budget.budget_amount) ||
                  Number(budget.dailyAverage) >
                    Number(budget.dailyRecomended)) && (
                  <div className="flex text-sm items-center mx-4 px-2 py-2 my-2 text-red-600 border border-red-600">
                    <PiWarning className="text-lg mr-2" />
                    <p>
                      {Number(budget.spentAmount) > Number(budget.budget_amount)
                        ? "Budget is exceeded!"
                        : Number(budget.dailyAverage) >
                            Number(budget.dailyRecomended) &&
                          "You risk overspending!"}
                    </p>
                  </div>
                )}
                <EChartsReact
                  option={{
                    grid: {
                      top: "10%",
                      left: "12%",
                      right: "15%",
                      bottom: "12%",
                    },
                    tooltip: {
                      trigger: "axis",
                      formatter: "{b0}<br />" + "{c0}K",
                    },
                    xAxis: {
                      type: "category",
                      boundaryGap: false,
                      data: budget.dates,
                    },
                    yAxis: {
                      type: "value",
                      position: "left",
                      max:
                        budget.spending[budget.spending.length - 1] >
                          Number(budget.budget_amount) ||
                        budget.forecast[budget.forecast.length - 1] >
                          Number(budget.budget_amount) ||
                        budget.overflow[budget.overflow.length - 1] >
                          Number(budget.budget_amount)
                          ? null
                          : Number(budget.budget_amount),
                      // max: budget.budget_amount,
                      axisLabel: {
                        formatter: "{value}",
                      },
                    },
                    visualMap: {
                      type: "piecewise",
                      dimension: 0,
                      show: false,
                      top: 0,
                      right: 10,
                      pieces: [
                        {
                          gt: -1,
                          lt:
                            budget.spending.findIndex(
                              (item) => item > budget.budget_amount
                            ) == -1
                              ? 10000
                              : budget.spending[
                                  budget.spending.findIndex(
                                    (item) => item > budget.budget_amount
                                  ) - 1
                                ] == budget.budget_amount
                              ? budget.spending.findIndex(
                                  (item) => item > budget.budget_amount
                                ) - 1
                              : budget.spending.findIndex(
                                  (item) => item > budget.budget_amount
                                ),
                          color: "#00C914",
                        },
                      ],
                      outOfRange: {
                        color: "#ff2e1f",
                      },
                      height: "50px",
                    },
                    series: [
                      {
                        data: budget.overflow,
                        type: "line",
                        showSymbol: false,
                        tooltip: {
                          show: false,
                        },
                        lineStyle: {
                          color: "red",
                        },
                      },
                      {
                        data: budget.spending,
                        markLine: {
                          silent: true,
                          symbol: "none",
                          label: {
                            show: true,
                            formatter: "Today",
                            color: "#94a3b8",
                          },
                          lineStyle: {
                            color: "#94a3b8",
                            type: "solid",
                          },
                          data: [
                            {
                              xAxis: moment().format("YYYY-MM-DD"),
                            },
                          ],
                        },
                        type: "line",
                        symbol: "emptyCircle",
                        showSymbol: true,
                        areaStyle: {},
                        showSymbol: true,
                      },
                      {
                        data: budget.forecast,
                        type: "line",
                        showSymbol: false,
                        markLine: {
                          silent: true,
                          symbol: "none",
                          label: {
                            show: true,
                            formatter: "Budget Limit",
                            color: "#475569",
                          },
                          lineStyle: {
                            color: "#ef4444",
                          },
                          data: [
                            {
                              yAxis: budget.budget_amount,
                            },
                          ],
                        },
                        tooltip: {
                          show: false,
                        },
                        lineStyle: {
                          color: "#2347BD",
                        },
                      },
                    ],
                  }}
                />
                <div className="px-6 pb-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm">
                        <NumericFormat
                          value={Number(budget.dailyAverage).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix={"Rp"}
                        />
                      </p>
                      <p className="text-xs">Daily average</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        <NumericFormat
                          value={Number(budget.dailyRecomended).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix={"Rp"}
                        />
                      </p>
                      <p className="text-xs">Daily recomended</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
