import { create } from "zustand";
import { accountsSettingSlice } from "./accountsSettingSlice";
import { categoriesSettingSlice } from "./categoriesSettingSlice";
import { transactionsSlice } from "./transactionsSlice";
import { budgetsSlice } from "./budgetsSlice";
import { globalSlice } from "./globalSlice";

export const useBoundedStore = create((...a) => ({
  ...globalSlice(...a),
  ...accountsSettingSlice(...a),
  ...categoriesSettingSlice(...a),
  ...transactionsSlice(...a),
  ...budgetsSlice(...a),
}));
