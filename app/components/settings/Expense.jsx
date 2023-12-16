import React, { useEffect, useState } from "react";
import { useStore } from "zustand";
import { useBoundedStore } from "@/app/store/boundedStore";
import DinamicIcon from "@/app/utils/DinamicIcon";
import { PiPlusCircleBold, PiTrashBold } from "react-icons/pi";
import AddEditIncomeExpense from "./AddEditIncomeExpense";

function Expense() {
  const boundedStore = useStore(useBoundedStore);
  const expenseCategories = useBoundedStore((state) => state.expenseCategories);

  const [showModal, setShowModal] = useState(false);
  const [expense, setExpense] = useState("");
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategory, setSubCategory] = useState([""]);

  // Open Modal to create a new category
  const handleAddNewCategory = () => {
    setExpense("");
    setShowModal(true);
  };

  // Open Modal to edit a category
  const handleEditCategory = (e, expense) => {
    if (
      e.target.id == "addSubCategoryButton" ||
      e.target.parentElement.id == "addSubCategoryButton"
    ) {
      return;
    }
    setSidebarIsOpen(false);
    setExpense(expense);
    setShowModal(true);
  };

  // Open Modal to modify sub category
  const handleAddSubCategory = (expense) => {
    setSelectedCategory(expense);
    setSidebarIsOpen(true);
    if (expense.sub_category) {
      setSubCategory([...expense.sub_category, ""]);
    }
  };

  // Close sub category modal component
  const handleCloseSubCategoryModal = (e) => {
    if (e.target !== e.currentTarget) {
      return;
    }
    setSidebarIsOpen(false);
    setSubCategory([""]);
    setSelectedCategory("");
  };

  // Delete a sub category
  const handleDeleteSubCategory = (Itemkey) => {
    setSubCategory(subCategory.filter((item, key) => key !== Itemkey));
  };

  // Handle when input value of cub category is change
  const handleChangeSubCategory = (e, subCategorykey) => {
    const subCategoryTemp = subCategory.map((item, key) => {
      return key == subCategorykey ? e.target.value : item;
    });
    const emptySubCategory = subCategoryTemp.filter((item) => item);
    const finalSubCategory = [...emptySubCategory, ""];

    setSubCategory(finalSubCategory);
  };

  // Save the sub category changes
  const handleSaveSubCategory = () => {
    const categoryId = selectedCategory.id;
    const newSubCategory = subCategory.filter((item) => item);
    boundedStore.updateSubCategory({ categoryId, newSubCategory });

    setSidebarIsOpen(false);
    setSubCategory([""]);
    setSelectedCategory("");
  };

  useEffect(() => {
    boundedStore.getCategories();
  }, []);

  return (
    <>
      {/* Add Category button */}
      <div className="mb-3 flex justify-end">
        <button
          onClick={handleAddNewCategory}
          className="bg-sky-500 px-4 py-2 text-white rounded-lg flex items-center shadow-md hover:bg-sky-600 hover:scale-105 transition-all"
        >
          <PiPlusCircleBold className="text-2xl mr-2" />
          Add Category
        </button>
      </div>

      {/* Categories items */}
      <div className="grid grid-cols-4 gap-4">
        {expenseCategories.map((expense, key) => (
          <div
            className="bg-white flex items-center p-3 rounded-lg cursor-pointer"
            onClick={(e) => handleEditCategory(e, expense)}
            key={key}
          >
            <div className="rounded-full bg-sky-300 aspect-square flex items-center justify-center p-2 shadow-lg cursor-pointer hover:bg-sky-400 mr-3">
              <DinamicIcon style="text-2xl" iconName={expense.icon_name} />
            </div>
            <p>{expense.category_name}</p>
            <div
              id="addSubCategoryButton"
              className="ml-auto bg-sky-500 p-1 rounded-md"
              onClick={() => handleAddSubCategory(expense)}
            >
              <PiPlusCircleBold
                id="addSubCategoryButton"
                className="text-2xl text-white"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal element to add new sub category */}
      <div
        className={`w-screen h-screen absolute flex justify-end top-0 left-0 bg-slate-950 bg-opacity-60 z-20 ${
          sidebarIsOpen ? "block" : "hidden"
        }`}
        onClick={(e) => handleCloseSubCategoryModal(e)}
      >
        <div className="bg-white p-2 rounded-lg m-2 h-[87.5vh] w-1/4 flex flex-col">
          <p className="font-semibold mb-8 text-center">Sub Category</p>
          <div className="h-full overflow-auto flex gap-y-3 flex-col px-4 py-4">
            {subCategory &&
              Object.assign(subCategory).map((val, key) => (
                <div className="flex" key={key}>
                  <input
                    type="text"
                    placeholder="Add new sub category..."
                    className="input-style w-full"
                    value={val}
                    onChange={(e) => handleChangeSubCategory(e, key)}
                  />
                  {val && (
                    <div
                      onClick={() => handleDeleteSubCategory(key)}
                      className="bg-red-500 flex justify-center items-center p-2 rounded-lg ml-3 cursor-pointer"
                    >
                      <PiTrashBold className="text-2xl text-white" />
                    </div>
                  )}
                </div>
              ))}
          </div>
          <div
            className="bg-sky-500 text-center my-2 rounded-lg py-2 font-semibold text-white shadow-lg hover:bg-sky-600 cursor-pointer"
            onClick={handleSaveSubCategory}
          >
            Save
          </div>
        </div>
      </div>

      {showModal && (
        <AddEditIncomeExpense
          setShowModal={setShowModal}
          item={expense}
          category="expense"
        />
      )}
    </>
  );
}

export default Expense;
