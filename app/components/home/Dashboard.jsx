import React from 'react'
import CurrentWeekStatistic from './CurrentWeekStatistic';
import RecentTransactions from './RecentTransactions';
import BalanceInformation from './BalanceInformation';
import TotalIncomeExpense from './TotalIncomeExpense';
import PieChart from './PieChart';

function Dashboard() {
  return (
    <div className="h-full grid grid-cols-10 grid-rows-6 gap-x-2">
      <div className="col-span-7 row-span-6 grid grid-cols-12 grid-rows-6 gap-2">
        <div className="col-span-12 row-span-2 bg-white rounded-lg shadow-xl grid grid-cols-8">
          <div className="col-span-3 border border-l-0 border-y-0 border-r-2">
            <BalanceInformation />
          </div>
          <div className="col-span-2 px-4">
            <TotalIncomeExpense />
          </div>
          <div className='col-span-3'>
            <PieChart />
          </div>
        </div>
        <div className="col-span-12 row-span-4 bg-white rounded-lg shadow-lg">
          <CurrentWeekStatistic />
        </div>
      </div>
      <div className="col-span-3 row-span-6 bg-white rounded-lg shadow-lg p-4 flex flex-col">
        <p className='text-sm font-semibold'>Recent Transactions</p>
        <RecentTransactions />
      </div>
    </div>
  );
}

export default Dashboard
