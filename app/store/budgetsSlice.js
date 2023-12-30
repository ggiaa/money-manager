import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase";

export const budgetsSlice = (set, get) => ({
  budgets: [],
  addBudgets: async (values, categories) => {
    const newBudget = {
      budget_name: values.name,
      budget_amount: values.amount,
      budget_categories: [],
    };

    categories.map((category) => {
      if (category.selected) {
        category.sub_category.map((sub) => {
          sub.selected ? newBudget.budget_categories.push(sub.name) : "";
        });
      }
    });

    const docRef = await addDoc(collection(db, "budgets"), newBudget);

    set((state) => ({
      budgets: [...state.budgets, { ...newBudget, id: docRef.id }],
    }));
  },
});
