import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const accountsSettingSlice = (set, get) => ({
  accounts: [],
  getAccounts: async () => {
    const q = query(collection(db, "accounts"), orderBy("created_at"));
    const querySnapshot = await getDocs(q);
    const filteredData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    set({ accounts: filteredData });
  },
  addAccount: async (params) => {
    const newAccount = {
      account_name: params.accountName,
      account_balance: parseInt(params.accountBalance),
      created_at: new Date(),
    };

    const docRef = await addDoc(collection(db, "accounts"), newAccount);
    set((state) => ({
      accounts: [...state.accounts, { ...newAccount, id: docRef.id }],
    }));
  },
  editAccount: async (params) => {
    await updateDoc(doc(db, "accounts", params.accountId), {
      account_name: params.accountName,
      account_balance: parseInt(params.accountBalance),
    });

    const acc = get().accounts.map((account) => {
      if (account.id == params.accountId) {
        account["account_name"] = params.accountName;
        account["account_balance"] = parseInt(params.accountBalance);
      }
      return account;
    });

    set({ accounts: acc });
  },
  deleteAccount: async ({ accountId }) => {
    await deleteDoc(doc(db, "accounts", accountId));
    const acc = get().accounts.filter((account) => account.id !== accountId);
    set({ accounts: acc });
  },
  subtractBalance: async ({ id, amount }) => {
    const updatedAccounts = await get().accounts.map((acc) => {
      const account = acc;
      if (account.id == id) {
        const newBalance = parseInt(account.account_balance) - parseInt(amount);
        account.account_balance = newBalance;
        updateDoc(doc(db, "accounts", id), {
          account_balance: newBalance,
        });
      }

      return account;
    });

    set({ accounts: updatedAccounts });
  },
  addBalance: async ({ id, amount }) => {
    const updatedAccounts = await get().accounts.map((acc) => {
      const account = acc;
      if (account.id == id) {
        const newBalance = parseInt(account.account_balance) + parseInt(amount);
        account.account_balance = newBalance;
        updateDoc(doc(db, "accounts", id), {
          account_balance: newBalance,
        });
      }

      return account;
    });

    set({ accounts: updatedAccounts });
  },
  recalculateBalance: async (originalTransaction, editedTransaction) => {
    const allAccounts = get().accounts;
    const originalAccID = originalTransaction.account_id;
    const editAccID = editedTransaction.account_id;
    const originalTransAmount = originalTransaction.amount;
    const editTransAmount = editedTransaction.amount;

    if (originalAccID != editAccID) {
      allAccounts.map((acc) => {
        const account = acc;
        let revertedBalance = account.account_balance;
        if (account.id == originalAccID) {
          if (originalTransaction.is_income) {
            revertedBalance -= originalTransAmount;
          } else if (originalTransaction.is_expense) {
            revertedBalance += originalTransAmount;
          }

          updateDoc(doc(db, "accounts", originalAccID), {
            account_balance: revertedBalance,
          });
        }

        if (account.id == editAccID) {
          if (editedTransaction.is_income) {
            revertedBalance += editTransAmount;
          } else if (editedTransaction.is_expense) {
            revertedBalance -= editTransAmount;
          }

          updateDoc(doc(db, "accounts", editAccID), {
            account_balance: revertedBalance,
          });
        }

        account.account_balance = revertedBalance;

        return account;
      });
    } else {
      allAccounts.map((acc) => {
        const account = acc;
        let updatedBalance = account.account_balance;
        if (account.id == originalAccID) {
          if (originalTransaction.is_income) {
            updatedBalance -= originalTransAmount;
          } else if (originalTransaction.is_expense) {
            updatedBalance += originalTransAmount;
          }

          if (editedTransaction.is_income) {
            updatedBalance += editTransAmount;
          } else if (editedTransaction.is_expense) {
            updatedBalance -= editTransAmount;
          }

          updateDoc(doc(db, "accounts", originalAccID), {
            account_balance: updatedBalance,
          });
        }

        account.account_balance = updatedBalance;

        return account;
      });
    }

    set({ accounts: allAccounts });
  },
});
