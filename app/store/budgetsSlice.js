import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import moment from "moment";
import calculateBudget from "../services/budgeting/calculateBudget";

export const budgetsSlice = (set, get) => ({
  budgets: [],
  getBudgets: async () => {
    const q = query(collection(db, "budgets"), orderBy("created_date", "desc"));
    const querySnapshot = await getDocs(q);
    const filteredData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const firstDate = moment().startOf("month").format("YYYY-MM-DD");
    const endDate = moment().endOf("month").format("YYYY-MM-DD");

    const transactions = get().transactionsByMonth;

    if (!transactions[moment().startOf("month").format("YYYYMM") + "01"]){
      await get().getSpecificMonthTransactions(firstDate, endDate);
    }

    set({ budgets: calculateBudget(filteredData, transactions[moment().startOf("month").format("YYYYMM") + "01"].transactions) });
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
          if (sub.selected) {
            const object = {
              category: category.category_name,
              sub_category: sub.name,
            };

            newBudget.budget_categories.push(object);
          }
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

    const transactions = get().transactionsByMonth;

    set({
      budgets: calculateBudget(
        budgetsData,
        transactions[moment().startOf("month").format("YYYYMM") + "01"]
          .transactions
      ),
    });
  },

  editBudgets: async (values, categories, budgetId) => {
    const updatedBudget = {
      budget_name: values.name,
      budget_amount: values.amount,
      budget_categories: [],
    };

    categories.map((category) => {
      if (category.selected) {
        category.sub_category.map((sub) => {
          if (sub.selected) {
            const object = {
              category: category.category_name,
              sub_category: sub.name,
            };
            updatedBudget.budget_categories.push(object);
          }
        });
      }
    });

    await updateDoc(doc(db, "budgets", budgetId), updatedBudget);

    const updatedBudgets = get().budgets.map((budget) => {
      if (budget.id == budgetId) {
        budget["budget_name"] = updatedBudget.budget_name;
        budget["budget_amount"] = updatedBudget.budget_amount;
        budget["budget_categories"] = updatedBudget.budget_categories;
      }
      return budget;
    });

    const transactions = get().transactionsByMonth;

    set({
      budgets: calculateBudget(
        updatedBudgets,
        transactions[moment().startOf("month").format("YYYYMM") + "01"]
          .transactions
      ),
    });
  },
});
