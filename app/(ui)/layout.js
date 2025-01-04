"use client";
import { useState } from "react";
import { Input, Tooltip } from "@nextui-org/react";
import Image from "next/image";
import {
  Ac,
  Bell,
  Cis,
  CneCloud,
  CneSystem,
  Company,
  Contact,
  Down,
  Hidden,
  Hide,
  Hr,
  IT,
  LeaveWork,
  Logo,
  Logout,
  Pu,
  Search,
} from "@/components/icons/icons";

function MenuHeader({ icons, text }) {
  return (
    <div className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
      <span className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
        {icons}
      </span>
      <span className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
        {text}
      </span>
    </div>
  );
}

function MenuHeaderHide({ icons, text }) {
  return (
    <div className="xl:hidden flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
      <span className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
        {icons}
      </span>
      <span className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
        {text}
      </span>
    </div>
  );
}

function MenuMain({ icons, text, isCollapsed }) {
  return (
    <div className="flex items-center justify-center w-full full p-2 gap-2 border-2 border-dark border-dashed">
      <Tooltip
        content={isCollapsed ? text : ""}
        size="lg"
        color="primary"
        radius="lg"
        shadow="lg"
        placement="right"
        showArrow={true}
        delay={300}
      >
        <span className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
          {icons}
        </span>
      </Tooltip>
      {!isCollapsed && (
        <>
          <span className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            {text}
          </span>
          <span className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Down />
          </span>
        </>
      )}
    </div>
  );
}
function MenuMainOther({ icons, onClick }) {
  return (
    <div
      className="flex items-center justify-center w-full full p-2 gap-2 border-2 border-dark border-dashed cursor-pointer"
      onClick={onClick}
    >
      <span className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
        {icons}
      </span>
    </div>
  );
}

export default function UiLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleMenu = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
      <div className="flex flex-row items-center justify-between w-full h-20 p-2 gap-4 border-2 border-dark border-dashed">
        <div className="flex flex-row items-center justify-center h-full px-8 py-2 gap-2 border-2 border-dark border-dashed bg-white rounded-full">
          <div className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed ">
            <Cis />
          </div>
          <div className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
            CIS
          </div>
        </div>
        <div className="flex flex-row items-center justify-between w-full h-full px-8 py-2 gap-2 border-2 border-dark border-dashed bg-white rounded-full">
          <MenuHeaderHide icons={<Hidden />} text="Hide" />
          <MenuHeader icons={<Company />} text="Cne" />
          <MenuHeader icons={<CneSystem />} text="System" />
          <MenuHeader icons={<CneCloud />} text="Cloud" />
          <MenuHeader icons={<LeaveWork />} text="Day Off" />
          <MenuHeader icons={<Logo />} text="Logo" />
          <MenuHeader icons={<Contact />} text="Contact" />
        </div>
        <div className="flex flex-row items-center justify-center h-full px-8 py-2 gap-2 border-2 border-dark border-dashed bg-white rounded-full">
          <div className="xl:flex hidden items-center justify-center w-60 h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Input
              type="text"
              placeholder="Search"
              size="sm"
              radius="full"
              variant="bordered"
              startContent={<Search />}
            />
          </div>
          <div className="flex items-center justify-center w-10 h-10 p-2 gap-2 border-2 border-dark border-dashed bg-default rounded-full">
            <Bell />
          </div>
          <div className="flex items-center justify-center w-10 h-10 p-2 gap-2 border-2 border-dark border-dashed bg-success rounded-full">
            <Image
              width={25}
              height={25}
              src="/images/picture/test.png"
              alt="test"
              priority={true}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center w-full h-full p-2 gap-6 border-2 border-dark border-dashed overflow-auto">
        <div
          className={`flex flex-col items-center justify-between ${
            isCollapsed ? "w-[10%]" : "w-[20%]"
          } h-full p-2 gap-2 border-2 border-dark border-dashed overflow-auto bg-white rounded-3xl`}
        >
          <MenuMainOther icons={<Hide />} onClick={handleToggleMenu} />
          <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <MenuMain
              icons={<Hr />}
              text="HR Department"
              isCollapsed={isCollapsed}
            />
            <MenuMain
              icons={<IT />}
              text="IT Department"
              isCollapsed={isCollapsed}
            />
            <MenuMain
              icons={<Ac />}
              text="AC Department"
              isCollapsed={isCollapsed}
            />
            <MenuMain
              icons={<Pu />}
              text="PU Department"
              isCollapsed={isCollapsed}
            />
          </div>
          <MenuMainOther icons={<Logout />} />
        </div>
        <div
          className={`flex flex-col items-center justify-between ${
            isCollapsed ? "w-[90%]" : "w-[80%]"
          } h-full p-2 gap-2 border-2 border-dark border-dashed overflow-auto bg-white rounded-3xl`}
        >
          <div className="flex flex-col items-center justify-center w-full full p-2 gap-2 border-2 border-dark border-dashed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
