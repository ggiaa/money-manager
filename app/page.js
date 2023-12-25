import Image from "next/image";
import RecentTransactions from "./components/home/RecentTransactions";
import CurrentWeekStatistic from "./components/home/CurrentWeekStatistic";

export default function Home() {
  return (
    <div className="h-full grid grid-cols-10 grid-rows-6 gap-x-2">
      <div className="col-span-7 row-span-6 grid grid-cols-12 grid-rows-6 gap-2">
        <div className="col-span-7 row-span-2 bg-white rounded-lg shadow-lg">
          Current Balance
        </div>
        <div className="col-span-5 row-span-2 bg-white rounded-lg shadow-lg">
          <p className="mb-4">2023 Progress</p>
          <div className="text-sm flex items-center gap-x-2 mb-2">
            <p>7 goals achieved</p>
          </div>
          <div className="text-sm flex items-center gap-x-2 mb-2">
            <p>3 goals in progress</p>
          </div>
          <div className="text-sm flex items-center gap-x-2 mb-2">
            <p>Rp10.000.000 saved</p>
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
