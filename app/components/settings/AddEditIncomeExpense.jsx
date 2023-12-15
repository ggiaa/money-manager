import React from "react";
import { PiTrashBold } from "react-icons/pi";
import * as Yup from "yup";
import { useFormik } from "formik";
import DinamicIcon from "@/app/utils/DinamicIcon";
import { useBoundedStore } from "@/app/store/boundedStore";
import { useStore } from "zustand";

const schema = Yup.object().shape({
  category_name: Yup.string().required("Category name cannot be left blank."),
});
function AddEditIncomeExpense({ setShowModal, item, category }) {
  const boundedStore = useStore(useBoundedStore);

  const formik = useFormik({
    initialValues: {
      icon_name: item ? item.icon_name : "LiaBreadSliceSolid",
      category_name: item ? item.category_name : "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const categoryName = values.category_name;
      const iconName = values.icon_name;
      const isIncome = item.is_income;
      const isExpense = item.is_expense;
      if (item) {
        const categoryId = item.id;
        boundedStore.editCategory({
          categoryId,
          categoryName,
          iconName,
          isIncome,
          isExpense,
        });
      } else {
        const categoryType = category;
        boundedStore.addCategory({
          categoryName,
          iconName,
          categoryType,
        });
      }
      setShowModal(false);
    },
  });
  const { errors, touched } = formik;

  const handleClose = (e) => {
    if (e.target !== e.currentTarget) {
      return;
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    const id = item.id;
    boundedStore.deleteCategory({ id, category });
    setShowModal(false);
  };

  const icons = {
    "Foods & Drinks": [
      "LiaBreadSliceSolid",
      "PiCookie",
      "PiWine",
      "PiBrandy",
      "PiCarrot",
      "PiHamburger",
      "PiIceCream",
      "PiMartini",
      "PiOrangeSlice",
      "PiPizza",
      "PiPopcorn",
      "PiCoffee",
      "PiCookingPot",
    ],
    House: [
      "LiaHomeSolid",
      "LiaBedSolid",
      "LiaBroomSolid",
      "PiLightbulbFilament",
      "PiDrop",
      "PiStorefront",
      "PiArmchair",
      "PiBathtub",
      "PiCouch",
      "PiHouseLine",
      "PiLamp",
      "PiPaintBrushBroad",
      "PiPaintRoller",
      "PiPen",
      "PiShower",
      "PiUmbrella",
      "PiWarehouse",
      "PiPlugs",
    ],
    Transportation: [
      "LiaCarSolid",
      "LiaShipSolid",
      "PiBus",
      "PiTrain",
      "PiTaxi",
      "PiMotorcycle",
      "PiAirplaneTilt",
      "PiCompass",
      "PiBoat",
      "PiCar",
      "PiGasPump",
      "PiMapPinLine",
      "PiMoped",
      "PiScooter",
      "PiSteeringWheel",
      "PiGlobeHemisphereWest",
      "PiChargingStation",
    ],
    Hobby: [
      "PiCamera",
      "PiGameController",
      "PiVolleyball",
      "PiTennisBall",
      "PiSoccerBall",
      "PiFootball",
      "PiBasketball",
      "PiBooks",
      "PiPalette",
      "PiTent",
      "PiFilmSlate",
      "PiRadio",
      "PiPersonSimpleBike",
      "PiCassetteTape",
      "PiFilmReel",
      "PiGoggles",
      "PiGuitar",
      "PiMountains",
      "PiPaintBrushDuotone",
      "PiParachute",
      "PiPlayCircle",
      "PiTelevisionBold",
      "PiMusicNote",
      "PiPark",
      "PiPersonSimpleRun",
    ],
    Personal: [
      "PiScissors",
      "PiTShirt",
      "PiWatch",
      "PiDress",
      "PiEyeglasses",
      "PiHighHeel",
      "PiHighlighterCircle",
      "PiHoodie",
      "PiPants",
      "PiShirtFolded",
      "PiSneaker",
      "PiBackpack",
      "PiBoot",
      "PiSketchLogo",
    ],
    Electricity: [
      "PiPhone",
      "PiMonitor",
      "PiHeadphones",
      "PiAlarm",
      "PiMicrophone",
      "PiPrinter",
      "PiRobot",
      "PiWifiHigh",
      "PiCellSignalFull",
      "PiBluetooth",
      "PiComputerTower",
      "PiDesktop",
      "PiDesktopTower",
      "PiDeviceMobile",
      "PiLightbulb",
      "PiLightning",
    ],
    Medical: [
      "PiSyringe",
      "PiThermometer",
      "PiVirus",
      "PiWheelchair",
      "LiaBriefcaseMedicalSolid",
      "PiTooth",
      "PiFirstAid",
      "PiPill",
    ],
    Social: [
      "PiBalloon",
      "PiHeart",
      "PiCake",
      "PiConfetti",
      "PiHandCoins",
      "PiSmiley",
      "PiPerson",
      "PiStar",
      "PiCactus",
      "PiGift",
      "PiMosque",
      "PiChurch",
      "PiPlant",
      "PiPottedPlant",
    ],
    Animals: ["PiBird", "PiCat", "PiDog", "PiFish", "PiHorse"],
    Others: [
      "PiPiggyBank",
      "PiGraduationCap",
      "PiCurrencyBtc",
      "PiBank",
      "PiBuildings",
      "PiCertificate",
      "PiTrophy",
      "PiCalendar",
      "PiSuitcaseSimple",
      "PiNewspaper",
      "PiEnvelopeSimple",
      "PiShoppingCartSimple",
      "PiKey",
      "PiWrench",
      "PiBaby",
      "PiBriefcase",
      "PiHammer",
      "LiaPenSolid",
    ],
  };

  return (
    <div
      onClick={(e) => handleClose(e)}
      className="w-screen h-screen absolute top-0 left-0 bg-slate-950 bg-opacity-60 flex justify-center items-center z-20"
    >
      <div className="bg-white py-8 px-16 rounded-lg w-[30rem] relative">
        {item && (
          <div className="absolute top-0 right-0" onClick={handleDelete}>
            <PiTrashBold className="text-2xl mr-3 mt-3 text-red-500 cursor-pointer" />
          </div>
        )}

        <p className="font-semibold mb-4 text-lg text-center">Category</p>

        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-y-4">
            <div className="flex">
              <div className="rounded-full bg-sky-300 aspect-square w-12 h-12 flex items-center justify-center p-1 shadow-lg cursor-pointer">
                <DinamicIcon
                  iconName={formik.values.icon_name}
                  style="text-2xl"
                />
              </div>
              <div className="flex flex-col flex-1 relative">
                <input
                  type="text"
                  placeholder="Category Name"
                  className="input-style-border-b"
                  name="category_name"
                  value={formik.values.category_name}
                  onChange={formik.handleChange}
                />
                {errors.category_name && touched.category_name && (
                  <span className="text-sm text-red-600 absolute -bottom-3">
                    {errors.category_name}
                  </span>
                )}
              </div>
            </div>
            <div>
              <div className="max-h-56 overflow-auto mt-4 flex flex-col gap-y-8 py-2 px-2">
                {Object.entries(icons).map(([key, values]) => (
                  <div key={key} className="grid grid-cols-5 gap-y-4 gap-x-5">
                    <div className="flex items-center justify-center col-span-5">
                      <hr className="w-full border-t border-gray-400" />
                      <div className="mx-4 text-center min-w-fit">{key}</div>
                      <hr className="w-full border-t border-gray-400" />
                    </div>
                    {values.map((icon, iconKey) => (
                      <div
                        key={iconKey}
                        onClick={() => formik.setFieldValue("icon_name", icon)}
                        className="rounded-full bg-sky-300 aspect-square flex items-center justify-center p-1 shadow-lg cursor-pointer hover:bg-sky-400"
                      >
                        <DinamicIcon iconName={icon} style="text-2xl" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
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

export default AddEditIncomeExpense;
