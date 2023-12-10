import { create } from "zustand";
import { accountsSettingSlice } from "./accountsSettingSlice";
import { categoriesSettingSlice } from "./categoriesSettingSlice";

export const useBoundedStore = create((...a) => ({
  ...accountsSettingSlice(...a),
  ...categoriesSettingSlice(...a),
}));
