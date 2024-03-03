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
import { GrMoney } from "react-icons/gr";
import moment from "moment";
import LoadingScreen from "./components/loadingScreen/LoadingScreen";
import Failed from "./components/general/Failed";
import Dashboard from "./components/home/Dashboard";

export default function Home() {
  const boundedStore = useStore(useBoundedStore);
  const isLoading = useBoundedStore(state => state.isLoading);
  const isFailed = useBoundedStore(state => state.isFailed);

  useEffect(() => {
    try {
      boundedStore.setIsLoading();
      boundedStore.fetchTransactions();
      boundedStore.getSpecificMonthTransactions();
      boundedStore.setOperationSuccess();
    } catch (error) {
      boundedStore.setOperationFailed();
    }
  }, []);

  return (
    <Dashboard />
  );
}
