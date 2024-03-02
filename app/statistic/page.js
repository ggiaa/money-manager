"use client";
import { NumericFormat } from "react-number-format";
import Calendar from "../components/statistic/Calendar";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { useBoundedStore } from "../store/boundedStore";
import moment from "moment";
import DinamicIcon from "../utils/DinamicIcon";
import { PiTrash, PiNotePencil } from "react-icons/pi";
import AddEditTransaction from "../components/navbar/AddEditTransaction";
import LoadingScreen from "../components/loadingScreen/LoadingScreen";
import Failed from "../components/general/Failed";
import StatisticMain from "../components/statistic/StatisticMain";

function statistic() {
  const boundedStore = useStore(useBoundedStore);
  const isLoading = useBoundedStore((state) => state.isLoading);
  const isFailed = useBoundedStore((state) => state.isFailed);

  const [calendarStart, setCalendarStart] = useState();
  const [calendarEnd, setCalendarEnd] = useState();

  useEffect(() => {
    boundedStore.setIsLoading(true);
    if (calendarStart && calendarEnd) {
      boundedStore.getSpecificMonthTransactions(calendarStart, calendarEnd);
    }
    boundedStore.setIsLoading(false);
  }, [calendarStart]);

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : isFailed ? (
        <Failed />
      ) : (
        <StatisticMain
          calendarStart={calendarStart}
          calendarEnd={calendarEnd}
          setCalendarStart={setCalendarStart}
          setCalendarEnd={setCalendarEnd}
        />
      )}
    </>
  );
}

export default statistic;
