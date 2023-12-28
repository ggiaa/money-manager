"use client";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";

function Calendar({
  transactions,
  transactionsAmount,
  setCalendarStart,
  setCalendarEnd,
  selectedDate,
  setSelectedDate,
}) {
  // all dates to be displayed
  const [dates, setDates] = useState([]);
  const [actualMonth, setActualMonth] = useState(new Date().getMonth());
  const [actualYear, setActualYear] = useState(new Date().getFullYear());

  const getDate = () => {
    setDates([]);
    const arr = [];
    const prevYear = actualMonth == 0 ? actualYear - 1 : actualYear;
    const nextYear = actualMonth == 11 ? actualYear + 1 : actualYear;
    const previousMonth = actualMonth - 1;
    const nextMonth = actualMonth + 1;

    let firstDateOfMonth = new Date(actualYear, actualMonth, 0).getDay();

    let lastDateOfMonth = new Date(actualYear, nextMonth, 0).getDate();
    let lastDayOfMonth = new Date(
      actualYear,
      actualMonth,
      lastDateOfMonth
    ).getDay();
    let lastDateOfPreviousMonth = new Date(
      actualYear,
      actualMonth,
      0
    ).getDate();

    let startdate = 1;
    let startmonth = actualMonth;
    let startyear = actualYear;
    let enddate = lastDateOfMonth;
    let endmonth = actualMonth;
    let endyear = actualYear;

    if (firstDateOfMonth !== 6) {
      startdate = lastDateOfPreviousMonth - firstDateOfMonth;
      startmonth = actualMonth - 1;
    }

    if (lastDayOfMonth !== 6) {
      enddate = 6 - lastDayOfMonth;
      endmonth = actualMonth + 1 > 11 ? 0 : actualMonth + 1;
    }

    setCalendarStart(
      moment(
        moment().set({ Year: actualYear, month: startmonth, date: startdate })
      ).format("YYYY-MM-DD")
    );
    setCalendarEnd(
      moment(
        moment().set({ Year: nextYear, month: endmonth, date: enddate })
      ).format("YYYY-MM-DD")
    );

    if (firstDateOfMonth < 6) {
      for (
        let i = lastDateOfPreviousMonth - firstDateOfMonth;
        i <= lastDateOfPreviousMonth;
        i++
      ) {
        const date = moment(
          moment().set({ Year: prevYear, month: previousMonth, date: i })
        ).format("YYYY-MM-DD");

        if (i == lastDateOfPreviousMonth - firstDateOfMonth) {
          setCalendarStart(date);
        }
        const foundItem = transactionsAmount.find((item) => item.date == date);
        arr.push({
          day: date,
          income: foundItem ? foundItem.income : 0,
          expense: foundItem ? foundItem.expense : 0,
        });
      }
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
      const date = moment(
        moment().set({ Year: actualYear, month: actualMonth, date: i })
      ).format("YYYY-MM-DD");

      const foundItem = transactionsAmount.find((item) => item.date == date);
      arr.push({
        day: date,
        income: foundItem ? foundItem.income : 0,
        expense: foundItem ? foundItem.expense : 0,
      });
    }

    for (let i = 1; i < 7 - lastDayOfMonth; i++) {
      const date = moment(
        moment().set({ Year: nextYear, month: nextMonth, date: i })
      ).format("YYYY-MM-DD");

      const foundItem = transactionsAmount.find((item) => item.date == date);
      arr.push({
        day: date,
        income: foundItem ? foundItem.income : 0,
        expense: foundItem ? foundItem.expense : 0,
      });
    }

    setDates(arr);
  };

  const changeToPreviousMonth = () => {
    if (actualMonth - 1 < 0) {
      setActualMonth(11);
      setActualYear(actualYear - 1);
    } else {
      setActualMonth(actualMonth - 1);
    }
  };

  const changeToNextMonth = () => {
    if (actualMonth + 1 > 11) {
      setActualMonth(0);
      setActualYear(actualYear + 1);
    } else {
      setActualMonth(actualMonth + 1);
    }
  };

  useEffect(() => {
    getDate();
  }, [actualMonth, actualYear, transactions]);

  return (
    <div>
      <div>
        <div>
          <div className="flex justify-between">
            <p className="text-left font-semibold mb-2 text-lg">
              {moment()
                .set({ Year: actualYear, month: actualMonth, date: 1 })
                .format("MMMM YYYY")}
            </p>
            <div className="flex gap-x-4 cursor-pointer">
              <div onClick={changeToPreviousMonth}>Previous</div>
              <div onClick={changeToNextMonth}>Next</div>
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
            {dates.map((date) => (
              <div
                key={date.day}
                className={`${date.day == selectedDate ? "bg-blue-200" : ""} ${
                  moment(date.day).get("month") == actualMonth
                    ? "text-black"
                    : "text-slate-400 bg-slate-50"
                }border-r-[1px] border-b-[1px] border w-[calc(100%/7)] h-[4.9rem] cursor-pointer flex flex-col`}
                onClick={() => setSelectedDate(date.day)}
              >
                <div className="flex-1">
                  <p>{moment(date.day).format("DD")}</p>
                </div>

                <div className="text-xs px-1 text-right">
                  {date.income > 0 && (
                    <p className="text-green-500">
                      <NumericFormat
                        value={date.income}
                        displayType={"text"}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix={"Rp"}
                      />
                    </p>
                  )}
                  {date.expense > 0 && (
                    <p className="text-red-500">
                      <NumericFormat
                        value={date.expense}
                        displayType={"text"}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix={"Rp"}
                      />
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
