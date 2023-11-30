"use client";
import React, { useState } from "react";
import {
  PiWallet,
  PiPalette,
  PiShoppingBag,
  PiCaretDown,
  PiCaretUp,
  PiGridFour,
  PiCoins,
} from "react-icons/pi";

function page() {
  const [selectedSettingMenu, setSelectedSettingMenu] = useState(1);
  const [subMenuActive, setSubMenuActive] = useState(false);

  const subMenuHandle = () => {
    setSubMenuActive(!subMenuActive);
  };

  return (
    <div className="bg-white h-full rounded grid grid-cols-4">
      {/* SIDEBARD */}
      <div class="w-full text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        <div className="flex flex-col pt-6">
          <div
            className={`setting-menu ${
              selectedSettingMenu == 1 ? "setting-selected-menu" : ""
            }`}
            onClick={() => setSelectedSettingMenu(1)}
          >
            <PiWallet className="setting-icon" />
            Accounts
          </div>
          <div
            className={`setting-menu ${
              selectedSettingMenu == 2 ? "setting-selected-menu" : ""
            }`}
            onClick={() => setSelectedSettingMenu(2)}
          >
            <PiPalette className="setting-icon" />
            Theme
          </div>
          <div onClick={subMenuHandle} className="setting-menu">
            <PiGridFour className="setting-icon" />
            Categories
            {subMenuActive ? (
              <PiCaretUp className="text-2xl ml-auto" />
            ) : (
              <PiCaretDown className="text-2xl ml-auto" />
            )}
          </div>
          <div className={`${subMenuActive ? "block" : "hidden"}`}>
            <div
              onClick={() => setSelectedSettingMenu(3)}
              className={`setting-submenu ${
                selectedSettingMenu == 3 ? "setting-selected-menu" : ""
              }`}
            >
              <PiCoins className="setting-icon" />
              <div className="select-none">Income</div>
            </div>
            <div
              onClick={() => setSelectedSettingMenu(4)}
              className={`setting-submenu ${
                selectedSettingMenu == 4 ? "setting-selected-menu" : ""
              }`}
            >
              <PiShoppingBag className="setting-icon" />
              <div className="select-none">Expense</div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-3">12</div>
    </div>
  );
}

export default page;
