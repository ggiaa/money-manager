import { create } from "zustand";
import { accountsSlice } from "./accountsSlice";

export const useBoundedStore = create((...a) => ({
  ...accountsSlice(...a),
}));
