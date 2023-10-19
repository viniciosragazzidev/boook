"use client";
import React, { useState, useContext, useEffect } from "react";
import {
  IoBook,
  IoGameController,
  IoSearch,
  IoTelescope,
  IoVideocam,
} from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

import Items from "./items";
import { AppContext } from "../_context/AppContext";

const Explore = () => {
  // Context
  const { fetching, fetchData, totalPages, currentCategory } =
    useContext(AppContext);

  // State and Router
  const searchParams = useSearchParams();
  const [pages, setPages] = useState(Number(searchParams.get("page")) || 1);
  const router = useRouter();

  const [currentItems, setCurrentItems] = React.useState(
    searchParams.get("type") || "filmes"
  );

  const [dataInput, setDataInput] = React.useState("");

  // Data for items
  const itemsPages = [
    { name: "filmes", icon: <IoVideocam /> },
    { name: "jogos", icon: <IoGameController /> },
    { name: "livros", icon: <IoBook /> },
  ];

  // Event Handlers
  const handleChangeTypePage = async (
    item: { name: string },
    pages?: number,
    category?: string
  ) => {
    setCurrentItems(item.name);
    setPages(pages || 1);

    const url = new URL(
      window.location.protocol + "//" + window.location.host + "/explore"
    );
    const params = new URLSearchParams();

    params.set("type", item.name);
    dataInput && params.set("search", dataInput);
    pages && params.set("page", pages.toString());
    category && params.set("category", category);
    url.search = params.toString();
    router.push(url.toString());
  };

  const refetchingForNewPage = (page: number) => {
    if (page > 0 && page < totalPages) {
      setPages(page);
      handleChangeTypePage({ name: currentItems }, page);
      fetchData();
    }
  };

  // useEffect
  useEffect(() => {
    handleChangeTypePage({ name: currentItems }, pages, currentCategory);
  }, [fetching, pages, currentCategory]);

  useEffect(() => {}, [currentCategory]);
  // Render
  return (
    <main className="w-full flex  justify-center gap-6 h-full md:pl-[280px] p-4 bg-cBlueDark min-h-screen">
      <div className="container flex flex-col gap-10">
        {/* Title Section */}
        <div className="title flex items-center justify-between py-6  max-sm:flex-col max-sm:gap-4 max-sm:items-center">
          <h1 className="text-xl text-cWhite flex items-center gap-2">
            <span className=" text-2xl text-cRed">
              <IoTelescope />
            </span>{" "}
            Explorer
          </h1>
          {/* Search Bar */}
          <div className=" flex">
            <input
              type="text"
              value={dataInput}
              onFocus={() => {
                window.addEventListener("keydown", (e) => {
                  if (e.key === "Enter") {
                    console.log(e.key);
                    fetchData();
                  }
                });
              }}
              onChange={(e) => {
                setDataInput(e.target.value);
                setPages(1);
              }}
              className="bg-transparent border-cBlue text-cWhite focus:outline focus:outline-cRed placeholder:text-cGray border rounded-md px-4  text-sm"
              placeholder="Faça sua pesquisa"
            />
            <span
              onClick={fetchData}
              className=" w-full h-full border border-cBlue py-2 px-2 rounded-md text-cRed text-2xl cursor-pointer"
            >
              <IoSearch />
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="content">
          {/* Navigation */}
          <nav className="flex justify-between">
            <ul className="flex gap-2 items-center">
              {itemsPages.map((item, index) => (
                <li
                  key={index}
                  onClick={() => {
                    handleChangeTypePage(item);
                  }}
                >
                  <button
                    className={`${
                      currentItems === item.name ? "bg-cRed" : "bg-cBlueLight"
                    } text-white  px-4 max-sm:px-2  h-8 rounded-md text-sm flex items-center gap-3 py-1 hover:bg-opacity-80 hover:scale-95 transition-all active:scale-90`}
                  >
                    {item.icon}
                    <span className="capitalize">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
            {/* Page Navigation */}
            <div className="flex text-cWhite gap-4 text-sm items-center">
              <span
                className="cursor-pointer text-2xl text-cRed"
                onClick={() => refetchingForNewPage(pages - 1)}
              >
                <RiArrowLeftSLine />
              </span>
              <span>{pages}</span>
              <span
                className="cursor-pointer text-2xl text-cRed"
                onClick={() => refetchingForNewPage(pages + 1)}
              >
                <RiArrowRightSLine />
              </span>
            </div>
          </nav>

          {/* Items */}
          <Items currentItem={currentItems} />
        </div>
      </div>
    </main>
  );
};

export default Explore;
