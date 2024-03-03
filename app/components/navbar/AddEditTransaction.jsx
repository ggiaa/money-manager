import { useBoundedStore } from "@/app/store/boundedStore";
import DinamicIcon from "@/app/utils/DinamicIcon";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import * as Yup from "yup";
import { useStore } from "zustand";
import Datepicker from "react-tailwindcss-datepicker";
import { PiCreditCard, PiGearSix } from "react-icons/pi";

const schema = Yup.object().shape({
  amount: Yup.string().required("Transaction amount cannot be left blank"),
  date: Yup.object().shape({
    startDate: Yup.string().required("Transaction date cannot be left blank"),
    endDate: Yup.string().required("Transaction date cannot be left blank"),
  }),
});

function AddEditTransaction({
  modalOpen,
  setModalOpen,
  transactionData = null,
}) {
  const [categoryDisplay, setCategoryDisplay] = useState(false);
  const [subCategoryDisplay, setSubCategoryDisplay] = useState(false);
  const [accountDisplay, setAccountDisplay] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeCategoryTab, setActiveCategoryTab] = useState(1);
  const boundedStore = useStore(useBoundedStore);
  const expenseCategories = useBoundedStore((state) => state.expenseCategories);
  const incomeCategories = useBoundedStore((state) => state.incomeCategories);
  const accounts = useBoundedStore((state) => state.accounts);

  const formik = useFormik({
    initialValues: {
      amount: "",
      category1: "Uncategorized",
      category2: "Uncategorized",
      icon: "PiQuestion",
      date: { startDate: new Date(), endDate: new Date() },
      account: "",
      accountId: "",
      note: "",
      is_income: "",
      is_expense: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      try {
        boundedStore.setIsLoading();
        
        if (transactionData) {
          boundedStore.editTransaction(transactionData.id, values);
        } else {
          boundedStore.addTransaction(values);
        }
        setModalOpen(false);
        formik.resetForm();
        
        boundedStore.setOperationSuccess();
      } catch (error) {
        boundedStore.setOperationFailed();
      }
    },
  });
  const { errors, touched } = formik;

  const handleClose = (e) => {
    if (e.target !== e.currentTarget) {
      return;
    }

    if (subCategoryDisplay) {
      setSubCategoryDisplay(false);
    } else if (categoryDisplay) {
      setCategoryDisplay(false);
    } else if (accountDisplay) {
      setAccountDisplay(false);
    } else {
      setModalOpen(false);
      formik.resetForm();
    }
  };

  const chooseCategory = () => {
    setCategoryDisplay(true);
  };

  const handleSelectCategory = (category) => {
    formik.setFieldValue("icon", category.icon_name);
    formik.setFieldValue("is_income", category.is_income);
    formik.setFieldValue("is_expense", category.is_expense);
    if (category.sub_category) {
      setSubCategoryDisplay(true);
      setSelectedCategory(category);
      formik.setFieldValue("category1", category.category_name);
    } else {
      formik.setFieldValue(
        "category1",
        category.is_income ? "Income" : "Expense"
      );
      formik.setFieldValue("category2", category.category_name);
      setCategoryDisplay(false);
    }
  };

  const handleSelectSubCategory = (subCategoryName) => {
    formik.setFieldValue("category2", subCategoryName);
    setSubCategoryDisplay(false);
    setCategoryDisplay(false);
    setSelectedCategory("");
  };

  const handleDateChange = (newValue) => {
    setDate(newValue);
  };

  const handleSelectAccount = (account) => {
    formik.setFieldValue("account", account.account_name);
    formik.setFieldValue("accountId", account.id);
    setAccountDisplay(false);
  };

  const chooseAccount = () => {
    setAccountDisplay(true);
  };

  useEffect(() => {
    try {
      boundedStore.setIsLoading();
      boundedStore.getCategories();
      boundedStore.getAccounts();
      boundedStore.setOperationSuccess();
    } catch (error) {
      boundedStore.setOperationFailed();
    }
  }, []);

  useEffect(() => {
    if (accounts.length) {
      const defaultAcc = accounts.filter((acc) => acc.priority);
      if (defaultAcc.length) {
        formik.setFieldValue("account", defaultAcc[0]["account_name"]);
        formik.setFieldValue("accountId", defaultAcc[0]["id"]);
      }
    }

    if (transactionData) {
      formik.setFieldValue("amount", transactionData.amount);
      formik.setFieldValue("category1", transactionData.category);
      formik.setFieldValue("category2", transactionData.sub_category);
      formik.setFieldValue("icon", transactionData.icon);
      formik.setFieldValue("date", {
        startDate: new Date(transactionData.date),
        endDate: new Date(transactionData.date),
      });
      formik.setFieldValue("account", transactionData.account);
      formik.setFieldValue("accountId", transactionData.account_id);
      formik.setFieldValue("note", transactionData.note);
      formik.setFieldValue("is_income", transactionData.is_income);
      formik.setFieldValue("is_expense", transactionData.is_expense);
    }else{
      formik.setFieldValue("date", {
        startDate: new Date(),
        endDate: new Date(),
      });
    }
  }, [modalOpen]);

  return (
    <div
      className={`${
        modalOpen ? "block" : "hidden"
      } fixed top-0 left-0 w-screen h-screen bg-slate-950 bg-opacity-60 flex justify-center items-center`}
      onClick={(e) => handleClose(e)}
    >
      <div className="bg-white w-5/12 relative rounded-md p-8">
        <p className="mb-5 text-center font-medium text-lg">New Transaction</p>

        {/* FORM */}
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-y-4">
            <div>
              <Datepicker
                inputClassName="input-style w-full text-black"
                placeholder="Transaction Date"
                useRange={false}
                asSingle={true}
                value={formik.values.date}
                onChange={(e) => formik.setFieldValue("date", e)}
              />
              {errors.date && touched.date && (
                <p className="text-sm text-left text-red-600">
                  {errors.date.endDate}
                </p>
              )}
            </div>
            <div>
              <NumericFormat
                placeholder="Amount"
                className="input-style w-full"
                displayType={"input"}
                thousandSeparator="."
                decimalSeparator=","
                prefix={"Rp"}
                name="amount"
                value={formik.values.amount}
                onValueChange={(values) =>
                  formik.setFieldValue("amount", values.value)
                }
                // onChange={formik.handleChange}
              />
              {errors.amount && touched.amount && (
                <p className="text-sm text-left text-red-600">
                  {errors.amount}
                </p>
              )}
            </div>
            <input
              type="text"
              placeholder="Uncategorized > Uncategorized"
              className="input-style-outline-none w-full"
              name="category"
              autoComplete="off"
              value={formik.values.category1 + " > " + formik.values.category2}
              onClick={chooseCategory}
              readOnly
            />
            <input
              type="text"
              placeholder="Account"
              className="input-style-outline-none w-full"
              name="account"
              autoComplete="off"
              value={formik.values.account}
              onClick={chooseAccount}
              readOnly
            />
            <input
              type="text"
              placeholder="Note"
              className="input-style w-full"
              name="note"
              value={formik.values.note}
              onChange={formik.handleChange}
            />
            <button
              className="bg-blue-600 rounded py-2 text-slate-50 font-medium"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>

        {/* Element to display category */}
        <div
          className={`bg-white absolute bottom-0 left-0 w-full ease-in duration-300 flex flex-col overflow-hidden rounded-md ${
            categoryDisplay ? "h-full" : "h-0"
          }`}
        >
          <div className="flex justify-center p-4">
            <div
              onClick={() => setActiveCategoryTab(1)}
              className="cursor-pointer w-28"
            >
              <h1
                className={`text-center ${
                  activeCategoryTab == 1
                    ? "text-blue-600 font-medium"
                    : "text-black font-medium"
                }`}
              >
                Expense
              </h1>
              <div
                className={`h-[3px] bg-blue-500 transition-all duration-500 ml-auto mt-1 ${
                  activeCategoryTab == 1 ? "w-full" : "w-0"
                }`}
              ></div>
            </div>
            <div
              onClick={() => setActiveCategoryTab(2)}
              className="cursor-pointer w-28"
            >
              <h1
                className={`text-center ${
                  activeCategoryTab == 2
                    ? "text-blue-600 font-medium"
                    : "text-black font-medium"
                }`}
              >
                Income
              </h1>
              <div
                className={`h-[3px] bg-blue-500 transition-all duration-500 mr-auto mt-1 ${
                  activeCategoryTab == 2 ? "w-full" : "w-0"
                }`}
              ></div>
            </div>
          </div>
          <div className="h-full overflow-auto">
            <div className="grid grid-cols-4 gap-y-8 mt-2 mb-6">
              {activeCategoryTab == 1 &&
                expenseCategories.map((category, i) => (
                  <div key={i} className="cursor-pointer w-full text-center">
                    <div
                      className="rounded-full bg-sky-300 aspect-square flex items-center justify-center p-2 shadow-lg cursor-pointer hover:bg-sky-400 w-4/12 mx-auto"
                      onClick={() => handleSelectCategory(category)}
                    >
                      <DinamicIcon
                        style="text-2xl"
                        iconName={category.icon_name}
                      />
                    </div>
                    <p className="text-sm mt-1">{category.category_name}</p>
                  </div>
                ))}
              {activeCategoryTab == 2 &&
                incomeCategories.map((category, i) => (
                  <div key={i} className="cursor-pointer w-full text-center">
                    <div
                      className="rounded-full bg-sky-300 aspect-square flex items-center justify-center p-2 shadow-lg cursor-pointer hover:bg-sky-400 w-4/12 mx-auto"
                      onClick={() => handleSelectCategory(category)}
                    >
                      <DinamicIcon
                        style="text-2xl"
                        iconName={category.icon_name}
                      />
                    </div>
                    <p className="text-sm mt-1">{category.category_name}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Element to display sub category */}
        <div
          className={`bg-white absolute bottom-0 left-0 w-full ease-in duration-300 flex flex-col overflow-auto rounded-md ${
            subCategoryDisplay ? "h-full" : "h-0"
          }`}
        >
          <div className="grid grid-cols-4 gap-y-8 my-6">
            {selectedCategory?.sub_category?.map((subcategory, i) => (
              <div key={i} className="cursor-pointer w-full text-center">
                <div
                  className="rounded-full bg-sky-300 aspect-square flex items-center justify-center p-2 shadow-lg cursor-pointer hover:bg-sky-400 w-4/12 mx-auto"
                  onClick={() => handleSelectSubCategory(subcategory)}
                >
                  <DinamicIcon
                    style="text-2xl"
                    iconName={selectedCategory.icon_name}
                  />
                </div>
                <p className="text-sm mt-1">{subcategory}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Element to display account */}
        <div
          className={`bg-white absolute bottom-0 left-0 w-full ease-in duration-300 flex flex-col overflow-auto rounded-md ${
            accountDisplay ? "h-full" : "h-0"
          }`}
        >
          <div className="grid grid-cols-2 gap-y-4 my-6 mx-4 gap-x-4">
            {accounts?.map((account, i) => (
              <div
                className="flex items-center bg-sky-600 text-white py-3 px-4 rounded-xl shadow-md cursor-pointer"
                key={i}
                onClick={() => handleSelectAccount(account)}
              >
                <div className="bg-orange-400 rounded-full p-2 mr-4">
                  <PiCreditCard className="text-3xl" />
                </div>
                <div className="h-full flex flex-col justify-between">
                  <p className="text-left font-semibold">
                    {account.account_name}
                  </p>
                  <p className="text-sm">
                    <NumericFormat
                      value={account.account_balance}
                      displayType={"text"}
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix={"Rp"}
                    />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEditTransaction;
