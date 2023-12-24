import { useBoundedStore } from "@/app/store/boundedStore";
import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import { useStore } from "zustand";
import * as Yup from "yup";
import { useFormik } from "formik";
import { PiTrashSimpleBold, PiTrashFill, PiTrashBold } from "react-icons/pi";

const schema = Yup.object().shape({
  account_name: Yup.string().required("Account name cannot be left blank."),
  account_balance: Yup.string().required(
    "Account balance cannot be left blank."
  ),
});

function AddEditAccount({ setShowModal, account = null }) {
  const formik = useFormik({
    initialValues: {
      account_name: account ? account.account_name : "",
      account_balance: account ? account.account_balance : "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const accountName = values.account_name;
      const accountBalance = values.account_balance;

      if (account) {
        // case edit an account
        const accountId = account.id;
        boundedStore.editAccount({ accountId, accountName, accountBalance });
        setShowModal(false);
      } else {
        // case add an account
        boundedStore.addAccount({ accountName, accountBalance });
        setShowModal(false);
      }
    },
  });

  const { errors, touched } = formik;

  const boundedStore = useStore(useBoundedStore);

  const handleClose = (e) => {
    if (e.target !== e.currentTarget) {
      return;
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    const accountId = account.id;
    boundedStore.deleteAccount({ accountId });
    setShowModal(false);
  };

  return (
    <div
      onClick={(e) => handleClose(e)}
      className="w-screen h-screen absolute top-0 left-0 bg-slate-950 bg-opacity-60 flex justify-center items-center z-20"
    >
      <div className="bg-white py-8 px-16 rounded-lg w-96 relative">
        {account && (
          <div className="absolute top-0 right-0">
            <PiTrashBold
              onClick={handleDelete}
              className="text-2xl mr-3 mt-3 text-red-500 cursor-pointer"
            />
          </div>
        )}

        <p className="font-semibold mb-4 text-lg text-center">Edit Account</p>

        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Account Name"
                className="input-style"
                name="account_name"
                value={formik.values.account_name}
                onChange={formik.handleChange}
              />
              {errors.account_name && touched.account_name && (
                <span className="text-sm text-red-600">
                  {errors.account_name}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <NumericFormat
                placeholder="Account Balance"
                className="input-style"
                displayType={"input"}
                thousandSeparator="."
                decimalSeparator=","
                prefix={"Rp"}
                name="account_balance"
                value={formik.values.account_balance}
                onValueChange={(values) =>
                  formik.setFieldValue("account_balance", values.value)
                }
              />
              {errors.account_balance && touched.account_balance && (
                <span className="text-sm text-red-600">
                  {errors.account_balance}
                </span>
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
      </div>
    </div>
  );
}

export default AddEditAccount;
