"use client";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import CalendarTotalIncomeExpense from "./CalendarTotalIncomeExpense";

function Calendar({
  transactionsAmount,
  setCalendarStart,
  setCalendarEnd,
  selectedDate,
  setSelectedDate,
}) {
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [calendarData, setCalendarData] = useState([]);

  const generateCalendarData = (month) => {
    const daysInMonth = month.daysInMonth();
    const dayOfWeek = month.startOf("month").format("d"); // Day of week (0-6) for the 1st
    const previousMonthDays = dayOfWeek > 0 ? dayOfWeek : 7 - dayOfWeek; // Empty boxes at the beginning

    const days = [];

    // Fill empty boxes from previous month
    if(previousMonthDays != 7){
      for (let i = 0; i < previousMonthDays; i++) {
        days.push({
          date: month.clone().subtract("days", previousMonthDays - i),
          isCurrentMonth: false,
        });
      }
    }

    setCalendarStart(month.clone().add("days", 0));
    // Fill actual days of the month
    for (let i = 0; i < daysInMonth; i++) {
      days.push({
        date: month.clone().add("days", i),
        isCurrentMonth: true,
      });
    }

    setCalendarEnd(days[days.length - 1].date);

    // Fill empty boxes for next month if needed
    const remainingBoxes = 7 - (days.length % 7);
      if (remainingBoxes != 7 && remainingBoxes > 0) {
        for (let i = 0; i < remainingBoxes; i++) {
          days.push({
          date: month.clone().add("days", days.length - (previousMonthDays == 7 ? 0 : previousMonthDays)),
          isCurrentMonth: false,
        });
      }
    }

    return days;
  };

  // console.log(transactionsAmount);
  useEffect(() => {
    const data = generateCalendarData(currentMonth);
    setCalendarData(data);
  }, [currentMonth]);

  return (
    <div>
      <div>
        <div>
          <div className="flex justify-between">
            <p className="text-left font-semibold mb-2 text-lg">
              {currentMonth.format("MMMM YYYY")}
            </p>
            <div className="flex gap-x-4 cursor-pointer">
              <div
                onClick={() =>
                  setCurrentMonth(currentMonth.clone().subtract(1, "months"))
                }
              >
                Previous
              </div>
              <div
                onClick={() =>
                  setCurrentMonth(currentMonth.clone().add(1, "months"))
                }
              >
                Next
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="w-[calc(100%/7)] text-center">
              <p fontSize={14}>SUN</p>
            </div>
            <div className="w-[calc(100%/7)] text-center">
              <p fontSize={14}>MON</p>
            </div>
            <div className="w-[calc(100%/7)] text-center">
              <p fontSize={14}>TUE</p>
            </div>
            <div className="w-[calc(100%/7)] text-center">
              <p fontSize={14}>WED</p>
            </div>
            <div className="w-[calc(100%/7)] text-center">
              <p fontSize={14}>THU</p>
            </div>
            <div className="w-[calc(100%/7)] text-center">
              <p fontSize={14}>FRI</p>
            </div>
            <div className="w-[calc(100%/7)] text-center">
              <p fontSize={14}>SAT</p>
            </div>
          </div>

          <div className="border border-t-[1px] border-l-[1px] flex flex-wrap">
            {calendarData.map((day, index) => (
              <div
                key={index}
                className={`${
                  day.date.format("YYYY-MM-DD") == selectedDate
                    ? "bg-blue-200"
                    : ""
                } ${
                  day.isCurrentMonth ? "text-black" : "text-slate-400 bg-slate-100"
                } border-r-[1px] border-b-[1px] border w-[calc(100%/7)] h-[4.9rem] cursor-pointer flex flex-col`}
                onClick={() => setSelectedDate(day.date.format("YYYY-MM-DD"))}
              >
                {day.isCurrentMonth && 
                <>
                  <div className="flex-1">
                    <p>{day.date.format("YYYY-MM-DD")}</p>
                  </div>

                  <div className="text-xs px-1 text-right">
                    <CalendarTotalIncomeExpense
                      transactionsAmount={transactionsAmount}
                      day={day.date.format("YYYY-MM-DD")}
                    />
                  </div>
                </>
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
