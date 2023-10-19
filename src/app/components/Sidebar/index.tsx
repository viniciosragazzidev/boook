"use client";
import React from "react";

import { usePathname } from "next/navigation";
import {
  RiCloseLine,
  RiGhost2Fill,
  RiGlobalFill,
  RiMenu2Line,
} from "react-icons/ri";
import { IoHome, IoLogoGoogle, IoPerson, IoTelescope } from "react-icons/io5";
import Button from "../Button";
import Link from "next/link";
const Sidebar = () => {
  const pathname = usePathname();
  const sidebarItems = [
    { name: "Home", href: "/", icon: <IoHome /> },
    { name: "Explorar", href: "/explore", icon: <IoTelescope /> },
    { name: "Perfil", href: "/about", icon: <IoPerson /> },
  ];

  const [open, setOpen] = React.useState(false);
  return (
    <>
      {pathname !== "/login" && (
        <>
          <span
            onClick={() => setOpen(!open)}
            className={`fixed  z-50 cursor-pointer text-xl text-cWhite m-2  p-1 rounded-e-md   hover:text-cRed sm:hidden transition-all ${
              open
                ? "translate-x-[220px] translate-y-[10px]  "
                : "translate-x-0"
            }`}
          >
            {open ? <RiCloseLine /> : <RiMenu2Line />}
          </span>
          <div
            className={`p-4 fixed top-0 left-0 w-full max-w-[280px] h-full transition-all ${
              open ? "max-md:translate-x-0" : "max-md:translate-x-[-100%]"
            }`}
          >
            <div className="bg-cBlueLight  h-full rounded-xl shadow-lg p-4 flex flex-col  items-center gap-20">
              <div className="logo flex items-center gap-1">
                <span className="text-4xl text-cRed">
                  <RiGhost2Fill />
                </span>{" "}
                <h1 className="text-cWhite font-bold text-4xl ">BoooK</h1>
              </div>

              <ul className="  flex flex-col gap-4 self-start pl-6">
                {sidebarItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={`text-base  cursor-pointer flex items-center gap-2 hover:text-cGray transition-colors ${
                        pathname === item.href
                          ? "text-white font-semibold"
                          : "text-cWhite"
                      }`}
                    >
                      <span className="text-lg text-cRed"> {item.icon} </span>{" "}
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className=" items-end flex-1 flex">
                <Link href={"/login"}>
                  <Button icon={<IoLogoGoogle />} className="">
                    Entrar com Google
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
