import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const categoriesSettingSlice = (set, get) => ({
  incomeCategories: [],
  expenseCategories: [],
  getCategories: async () => {
    const q = query(collection(db, "categories"));
    const querySnapshot = await getDocs(q);
    const filteredData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const income = filteredData
      .filter((category) => category.is_income)
      .sort((a, b) => a.category_name.localeCompare(b.category_name));
    const expense = filteredData
      .filter((category) => category.is_expense)
      .sort((a, b) => a.category_name.localeCompare(b.category_name));

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
    } else {
      const expense = get().expenseCategories.map((expense) => {
        if (expense.id == params.categoryId) {
          expense["category_name"] = params.categoryName;
          expense["icon_name"] = params.iconName;
        }
        return expense;
      });

      set({ expenseCategories: expense });
    }
  },
  addCategory: async (params) => {
    const category = {
      category_name: params.categoryName,
      icon_name: params.iconName,
      is_income: params.categoryType == "income",
      is_expense: params.categoryType == "expense",
    };

    const docRef = await addDoc(collection(db, "categories"), category);

    const newCategory = { ...category, id: docRef.id };

    if (params.categoryType == "income") {
      const joinedIncome = [...get().incomeCategories, newCategory].sort(
        (a, b) => a.category_name.localeCompare(b.category_name)
      );

      set({ incomeCategories: joinedIncome });
    } else {
      const joinedExpense = [...get().expenseCategories, newCategory].sort(
        (a, b) => a.category_name.localeCompare(b.category_name)
      );

      set({ expenseCategories: joinedExpense });
    }
  },
  deleteCategory: async ({ id, category }) => {
    await deleteDoc(doc(db, "categories", id));

    if (category == "income") {
      const inc = get().incomeCategories.filter(
        (category) => category.id !== id
      );
      set({ incomeCategories: inc });
    } else {
      const exp = get().expenseCategories.filter(
        (category) => category.id !== id
      );
      set({ expenseCategories: exp });
    }
  },
  updateSubCategory: async ({ categoryId, newSubCategory }) => {
    await updateDoc(doc(db, "categories", categoryId), {
      sub_category: newSubCategory,
    });

    const exp = get().expenseCategories.map((category) => {
      if (category.id == categoryId) {
        category["sub_category"] = newSubCategory;
      }

      return category;
    });

    set({ expenseCategories: exp });
  },
});
