import { create } from "zustand";
import { accountsSettingSlice } from "./accountsSettingSlice";
import { categoriesSettingSlice } from "./categoriesSettingSlice";
import { transactionsSlice } from "./transactionsSlice";

export const useBoundedStore = create((...a) => ({
  ...accountsSettingSlice(...a),
  ...categoriesSettingSlice(...a),
  ...transactionsSlice(...a),
}));
