import moment from "moment";
import React from "react";
import { NumericFormat } from "react-number-format";

function Progress({ part, whole, budget }) {
  const progress = (Number(part) / Number(whole)).toFixed(2) * 100;
  const progressWithPercent = progress + "%";

  console.log(progressWithPercent);
  const overspend = Number(part) - Number(whole);
  const remains = Number(whole) - Number(part);

  return (
    <div>
      <div className="flex justify-between mb-1 text-xs items-end">
        <div>
          <NumericFormat
            value={budget}
            className="text-base"
            displayType={"text"}
            thousandSeparator="."
            decimalSeparator=","
            prefix={"Rp"}
          />
        </div>
        <p>{progressWithPercent}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 flex">
        <div
          className={`${
            progress >= 100 ? "bg-red-600" : "bg-blue-600"
          } h-2.5 rounded-full`}
          style={{ width: progressWithPercent }}
        ></div>
      </div>
      <div className="flex justify-between mb-1">
        <div className="text-xs">
          <p>spent</p>
          <NumericFormat
            value={part}
            displayType={"text"}
            thousandSeparator="."
            decimalSeparator=","
            prefix={"Rp"}
          />
        </div>
        <div className="text-right text-xs">
          <p>
            {(Number(part) / Number(whole)) * 100 > 100
              ? "overspend"
              : "remains"}
          </p>
          <NumericFormat
            value={
              (Number(part) / Number(whole)) * 100 > 100 ? overspend : remains
            }
            displayType={"text"}
            thousandSeparator="."
            decimalSeparator=","
            prefix={"Rp"}
          />
        </div>
      </div>
    </div>
  );
}

export default Progress;
