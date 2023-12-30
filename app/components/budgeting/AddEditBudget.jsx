import React, { useEffect, useState } from "react";
import {
  PiCheck,
  PiCheckCircleBold,
  PiCheckCircleFill,
  PiCircleBold,
  PiTrashBold,
} from "react-icons/pi";
import { NumericFormat } from "react-number-format";
import * as Yup from "yup";
import { useFormik } from "formik";
import DinamicIcon from "@/app/utils/DinamicIcon";
import { useBoundedStore } from "@/app/store/boundedStore";
import { useStore } from "zustand";

const schema = Yup.object().shape({
  name: Yup.string().required("Budget name cannot be left blank."),
  amount: Yup.string().required("Budget amount cannot be left blank."),
  categories: Yup.string().required("Budget categories cannot be left blank."),
});
function AddEditBudget({ setAddEditModalDisplay, budget = null }) {
  const [categoryDisplay, setCategoryDisplay] = useState(false);
  const [subCategoryDisplay, setSubCategoryDisplay] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const boundedStore = useStore(useBoundedStore);
  const [expenseCategories, setexpenseCategories] = useState(
    useBoundedStore((state) => state.expenseCategories).map((category) => {
      const subcategory = category.sub_category.map((sub) => {
        const subcategoriesObject = {
          name: sub,
          selected: false,
        };
        return subcategoriesObject;
      });
      return { ...category, selected: false, sub_category: subcategory };
    })
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      amount: "",
      categories: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      boundedStore.addBudgets(values, expenseCategories);
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

      let count = 0;
      expenseCategories.map((category) => {
        category.sub_category.map((sub) => {
          sub.selected ? count++ : "";
        });
      });
      formik.setFieldValue(
        "categories",
        count > 1
          ? count + " categories selected"
          : count + " category selected"
      );
    } else {
      setAddEditModalDisplay(false);
    }
  };

  const chooseCategory = () => {
    setCategoryDisplay(true);
  };

  const handleSelectCategory = (category) => {
    if (category.sub_category) {
      setSubCategoryDisplay(true);
      setSelectedCategory(category);
    } else {
      setCategoryDisplay(false);
    }
  };

  const handleSelectSubCategory = (subCategoryName) => {
    setSubCategoryDisplay(false);
    setCategoryDisplay(false);
    setSelectedCategory("");
  };

  const checkCategory = (category) => {
    const newexpenseCategories = expenseCategories.map((cat) => {
      if (cat.id == category.id) {
        cat.selected = !category.selected;

        if (category.selected) {
          // kalau udah keselect, berarti hilangkan checklist dari semua sub categorynya
          cat.sub_category.map((sub) => {
            sub.selected = true;
          });
        } else {
          cat.sub_category.map((sub) => {
            sub.selected = false;
          });
        }
      }

      return cat;
    });
    setexpenseCategories(newexpenseCategories);
  };

  const checkSubCategory = (selectedCategory, subcategory) => {
    const newexpenseCategories = expenseCategories.map((expense) => {
      if (expense.id == selectedCategory.id) {
        expense.sub_category.map((sub) => {
          if (sub.name == subcategory.name) {
            sub.selected = !sub.selected;
          }
        });

        // unselec category kalau tidak ada subcategory yang dipilih
        if (!expense.sub_category.some((obj) => obj.selected == true)) {
          expense.selected = false;
        }
      }
      return expense;
    });

    setexpenseCategories(newexpenseCategories);
  };

  useEffect(() => {
    boundedStore.getCategories();
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-slate-950 bg-opacity-60 flex justify-center items-center"
      onClick={(e) => handleClose(e)}
    >
      <div className="bg-white w-5/12 relative rounded-md p-8">
        <p className="mb-5 text-center font-medium text-lg">New Budget</p>

        {/* FORM */}
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-y-4">
            <div>
              <input
                type="text"
                placeholder="Budget Name"
                className="input-style w-full"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              {errors.name && touched.name && (
                <p className="text-sm text-left text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <NumericFormat
                placeholder="Budget Amount"
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
              />
              {errors.amount && touched.amount && (
                <p className="text-sm text-left text-red-600">
                  {errors.amount}
                </p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Categories"
                className="input-style-outline-none w-full"
                name="categories"
                autoComplete="off"
                value={formik.values.categories}
                onClick={chooseCategory}
                readOnly
              />
              {errors.categories && touched.categories && (
                <p className="text-sm text-left text-red-600">
                  {errors.categories}
                </p>
              )}
            </div>
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
          <div className="h-full overflow-auto">
            <div className="grid grid-cols-4 gap-y-8 mt-6 mb-6">
              {expenseCategories.map((category, i) => (
                <div
                  key={i}
                  className="cursor-pointer w-full text-center relative "
                >
                  <div
                    className="rounded-full bg-sky-300 aspect-square flex items-center justify-center p-2 shadow-lg cursor-pointer hover:bg-sky-400 w-4/12 mx-auto"
                    onClick={() => handleSelectCategory(category)}
                  >
                    <DinamicIcon
                      style="text-2xl"
                      iconName={category.icon_name}
                    />
                  </div>
                  <div className="block w-5 top-0 right-6 absolute">
                    {category.selected ||
                    category.sub_category.some(
                      (obj) => obj.selected == true
                    ) ? (
                      <PiCheckCircleFill
                        onClick={() => checkCategory(category)}
                        className="text-2xl text-sky-600"
                      />
                    ) : (
                      <PiCircleBold
                        onClick={() => checkCategory(category)}
                        className="text-2xl text-sky-600"
                      />
                    )}
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
              <div
                key={i}
                className="cursor-pointer w-full text-center relative"
              >
                <div
                  className="rounded-full bg-sky-300 aspect-square flex items-center justify-center p-2 shadow-lg cursor-pointer hover:bg-sky-400 w-4/12 mx-auto"
                  onClick={() => handleSelectSubCategory(subcategory)}
                >
                  <DinamicIcon
                    style="text-2xl"
                    iconName={selectedCategory.icon_name}
                  />
                </div>
                <div className="block w-5 top-0 right-6 absolute">
                  {subcategory.selected ? (
                    <PiCheckCircleFill
                      onClick={() =>
                        checkSubCategory(selectedCategory, subcategory)
                      }
                      className="text-2xl text-sky-600"
                    />
                  ) : (
                    <PiCircleBold
                      onClick={() =>
                        checkSubCategory(selectedCategory, subcategory)
                      }
                      className="text-2xl text-sky-600"
                    />
                  )}
                </div>
                <p className="text-sm mt-1">{subcategory.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEditBudget;
