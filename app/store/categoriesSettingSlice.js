import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const categoriesSettingSlice = (set, get) => ({
  incomeCategories: [],
  expenseCategories: [],
  getCategories: async () => {
    const q = query(collection(db, "categories"), orderBy("category_name"));
    const querySnapshot = await getDocs(q);
    const filteredData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const income = filteredData.filter((category) => category.is_income);
    const expense = filteredData.filter((category) => category.is_expense);

    set({ incomeCategories: income, expenseCategories: expense });
  },
  editCategory: async (params) => {
    await updateDoc(doc(db, "categories", params.categoryId), {
      category_name: params.categoryName,
      icon_name: params.iconName,
    });

    if (params.isIncome) {
      const income = get().incomeCategories.map((income) => {
        if (income.id == params.categoryId) {
          income["category_name"] = params.categoryName;
          income["icon_name"] = params.iconName;
        }
        return income;
      });

      set({ incomeCategories: income });
    }
  },
});
