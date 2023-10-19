import React from "react";
import Button from "../components/Button";
import { IoLogoGoogle } from "react-icons/io5";
import { RiGhost2Fill, RiGhost2Line } from "react-icons/ri";
import Image from "next/image";
const LoginPage = () => {
  return (
    <div className="flex justify-center  bg-cBlueDark">
      <div className="container w-full min-h-screen py-10  flex  justify-center gap-3">
        <div className="img fixed  top-0 left-0 w-full max-w-[280px]  overflow-hidden sm:max-w-xs opacity-25 max-sm:opacity-20 rotate-[25deg] z-10">
          <Image
            src="/images/mario.png"
            alt="cover"
            width={500}
            height={500}
            className="w-full h-full "
          />
        </div>
        <Image
          src="/images/sonic.png"
          alt="cover"
          width={500}
          height={500}
          className="absolute top-0 right-0 max-w-xs opacity-25  z-10 max-[820px]:hidden  "
        />
        <div className="flex-1 h-full flex justify-center items-center p-4 flex-col gap-20 max-w-xl z-50 ">
          <div className="logo flex items-center gap-2">
            <span className="text-4xl text-cRed">
              <RiGhost2Fill />
            </span>{" "}
            <h1 className="text-cWhite font-bold text-4xl ">BoooK</h1>
          </div>
          <div className="content flex flex-col items-center text-center gap-6">
            <h1 className="text-cWhite font-semibold text-3xl ">
              Conecte-se e conheça comunidades no mundo do entretenimento
            </h1>
            <p className="text-cGray text-sm">
              Avalie, discute e compartilhe sobre o que esta rolando no mundo do
              entretenimento.
            </p>
          </div>
          <Button icon={<IoLogoGoogle />} className="">
            Entrar com Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
