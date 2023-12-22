import Link from "next/link";
import React, { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineLineChart,
  AiOutlineCreditCard,
  AiOutlineSetting,
  AiOutlinePlus,
} from "react-icons/ai";
import AddEditTransaction from "./AddEditTransaction";

function BottomNavbar({ segments }) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="bg-white grid grid-cols-5 items-center text-center gap-4 w-2/5 rounded-full py-1 shadow-lg border border-slate-300">
      {/* Home Link */}
      <div className="overflow-hidden">
        <Link href="/">
          <AiOutlineHome
            className={`navbar-icon ${
              !segments.length ? "text-blue-600" : "translate-y-2"
            }`}
          />
          <p
            className={`navbar-text ${
              !segments.length ? "text-blue-600" : "translate-y-4"
            }`}
          >
            Home
          </p>
        </Link>
      </div>

      {/* Statistic Link */}
      <div className="overflow-hidden">
        <Link href="/statistic">
          <AiOutlineLineChart
            className={`navbar-icon ${
              segments.includes("statistic") ? "text-blue-600" : "translate-y-2"
            }`}
          />
          <p
            className={`navbar-text ${
              segments.includes("statistic") ? "text-blue-600" : "translate-y-4"
            }`}
          >
            Statistic
          </p>
        </Link>
      </div>

      {/* Add transaction Link */}
      <div className="relative h-full">
        <div
          onClick={() => setModalOpen(true)}
          className="absolute bg-blue-600 p-1 right-0 left-0 top-0 bottom-0 rounded-full origin-center h-full scale-150 mx-auto aspect-square border border-slate-300 group hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-blue-400 transition-all ease-out duration-300 overflow-hidden"
        >
          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
          <AiOutlinePlus className="text-white text-2xl mx-auto h-full  group-hover:rotate-90 duration-500 ease" />
        </div>
      </div>

      {/* Budgeting Link */}
      <div className="overflow-hidden">
        <Link href="/budgeting">
          <AiOutlineCreditCard
            className={`navbar-icon ${
              segments.includes("budgeting") ? "text-blue-600" : "translate-y-2"
            }`}
          />
          <p
            className={`navbar-text ${
              segments.includes("budgeting") ? "text-blue-600" : "translate-y-4"
            }`}
          >
            Budgeting
          </p>
        </Link>
      </div>

      {/* Settings Link */}
      <div className="overflow-hidden">
        <Link href="/settings">
          <AiOutlineSetting
            className={`navbar-icon ${
              segments.includes("settings") ? "text-blue-600" : "translate-y-2"
            }`}
          />
          <p
            className={`navbar-text ${
              segments.includes("settings") ? "text-blue-600" : "translate-y-4"
            }`}
          >
            Settings
          </p>
        </Link>
      </div>

      <AddEditTransaction modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </div>
  );
}

export default BottomNavbar;
