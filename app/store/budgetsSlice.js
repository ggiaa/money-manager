import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const budgetsSlice = (set, get) => ({
  budgets: [],
  getBudgets: async () => {
    const q = query(collection(db, "budgets"), orderBy("created_date", "desc"));
    const querySnapshot = await getDocs(q);
    const filteredData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    set({ budgets: filteredData });
  },
  addBudgets: async (values, categories) => {
    const newBudget = {
      budget_name: values.name,
      budget_amount: values.amount,
      budget_categories: [],
      created_date: new Date(),
    };

    categories.map((category) => {
      if (category.selected) {
        category.sub_category.map((sub) => {
          sub.selected ? newBudget.budget_categories.push(sub.name) : "";
        });
      }
    });

    const docRef = await addDoc(collection(db, "budgets"), newBudget);

    const budgetsData = [
      ...get().budgets,
      { ...newBudget, id: docRef.id },
    ].sort((a, b) => {
      return b.created_date - a.created_date;
    });

    set({ budgets: budgetsData });

    console.log(get().budgets);
  },
});
