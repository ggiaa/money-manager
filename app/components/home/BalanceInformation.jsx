import { useBoundedStore } from '@/app/store/boundedStore';
import React from 'react'
import { NumericFormat } from "react-number-format";

function BalanceInformation() {
    const totalBalance = useBoundedStore((state) => state.totalBalance);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center gap-x-2 p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-8 h-8 fill-green-600 "
        >
          <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
          <path
            fillRule="evenodd"
            d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z"
            clipRule="evenodd"
          />
          <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
        </svg>
        <p className="text-xl">Money Manager</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center mb-4">
        <p className="mb-2">Current Balance</p>
        <div>
          <span className="text-3xl font-semibold">
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
    </div>
  );
}

export default BalanceInformation
