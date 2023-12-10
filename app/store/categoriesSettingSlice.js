import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase";

export const categoriesSettingSlice = (set, get) => ({
  incomeCategories: [],
  expenseCategories: [],
  getCategories: async () => {
    const q = query(collection(db, "categories"), orderBy("name"));
    const querySnapshot = await getDocs(q);
    const filteredData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const income = filteredData.filter((category) => category.is_income);
    const expense = filteredData.filter((category) => category.is_expense);

    set({ incomeCategories: income, expenseCategories: expense });
  },
});
