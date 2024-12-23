"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { useSelectedLayoutSegments } from "next/navigation";
import BottomNavbar from "./components/navbar/BottomNavbar";
import { useState } from "react";
import LoadingScreen from "./components/loadingScreen/LoadingScreen";
import Failed from "./components/general/Failed";
import { useBoundedStore } from "./store/boundedStore";

const inter = Inter({ subsets: ["latin"] });

const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  const segments = useSelectedLayoutSegments();
  const [modalOpen, setModalOpen] = useState(false);
  const isLoading = useBoundedStore((state) => state.isLoading);
  const isFailed = useBoundedStore((state) => state.isFailed);

  console.log(isLoading);
  return (
    <html lang="en" className="bg-slate-300">
      <body className={inter.className}>
        {isLoading ? (
          <LoadingScreen />
        ) : isFailed ? (
          <Failed />
        ) : (
          <>
            <div className="h-[90vh] p-2">{children}</div>

            {/* Bottom Navigation */}
            <div className="h-[10vh] flex justify-center items-center pb-2">
              <BottomNavbar segments={segments} setModalOpen={setModalOpen} />
            </div>
          </>
        )}

      </body>
    </html>
  );
}
