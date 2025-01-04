"use client";
import { useState, useEffect, useRef } from "react";
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

function MenuHeaderHide({ icons, onClick }) {
  return (
    <div
      className="xl:hidden flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed cursor-pointer"
      onClick={onClick}
    >
      <span className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
        {icons}
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
        delay={100}
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isMobileHeaderOpen, setIsMobileHeaderOpen] = useState(false);

  const sideMenuRef = useRef(null);
  const mobileHeaderRef = useRef(null);

  const handleToggleMenu = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleOpenMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleHeaderMenu = () => {
    setIsMobileHeaderOpen((prev) => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isMobileMenuOpen &&
        sideMenuRef.current &&
        !sideMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
      if (
        isMobileHeaderOpen &&
        mobileHeaderRef.current &&
        !mobileHeaderRef.current.contains(event.target)
      ) {
        setIsMobileHeaderOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen, isMobileHeaderOpen]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
      <div className="flex flex-row items-center justify-between w-full h-20 p-2 gap-4 border-2 border-dark border-dashed">
        <div
          className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed bg-white rounded-full cursor-pointer xl:hidden"
          onClick={handleOpenMobileMenu}
        >
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Cis />
          </div>
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            CIS
          </div>
        </div>
        <div className="hidden xl:flex flex-row items-center justify-center h-full px-8 py-2 gap-2 border-2 border-dark border-dashed bg-white rounded-full">
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Cis />
          </div>
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            CIS
          </div>
        </div>
        <div className="hidden xl:flex flex-row items-center justify-between w-full h-full px-8 py-2 gap-2 border-2 border-dark border-dashed bg-white rounded-full">
          <MenuHeaderHide icons={<Hidden />} onClick={toggleHeaderMenu} />
          <MenuHeader icons={<Company />} text="Cne" />
          <MenuHeader icons={<CneSystem />} text="System" />
          <MenuHeader icons={<CneCloud />} text="Cloud" />
          <MenuHeader icons={<LeaveWork />} text="Day Off" />
          <MenuHeader icons={<Logo />} text="Logo" />
          <MenuHeader icons={<Contact />} text="Contact" />
        </div>
        <div className="xl:hidden flex flex-col relative w-full h-full p-2 gap-2 bg-white border-2 border-dark border-dashed rounded-full">
          <MenuHeaderHide icons={<Hidden />} onClick={toggleHeaderMenu} />
          {isMobileHeaderOpen && (
            <div
              className="absolute top-[100%] right-0 flex flex-col items-center justify-center w-[222px] p-2 mt-[16px] gap-2 bg-white border-2 border-dark border-dashed z-50"
              ref={mobileHeaderRef}
            >
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <MenuHeader icons={<Company />} text="Cne" />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <MenuHeader icons={<CneSystem />} text="System" />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <MenuHeader icons={<CneCloud />} text="Cloud" />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <MenuHeader icons={<LeaveWork />} text="Day Off" />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <MenuHeader icons={<Logo />} text="Logo" />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <MenuHeader icons={<Contact />} text="Contact" />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-row items-center justify-center h-full p-2 xl:px-8 xl:py-2 gap-2 border-2 border-dark border-dashed bg-white rounded-full">
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
      <div className="flex flex-row items-start justify-center w-full h-full p-2 gap-6 border-2 border-dark border-dashed overflow-auto">
        <div
          ref={sideMenuRef}
          className={`
            ${isMobileMenuOpen ? "flex" : "hidden"}
            xl:flex 
            flex-col items-center justify-between
            ${isCollapsed ? "xl:w-[15%]" : "xl:w-[25%]"}
            w-[80%] 
            h-full p-2 gap-2 border-2 border-dark border-dashed 
            overflow-auto bg-white rounded-3xl fixed xl:static
            top-0 left-0 z-50
          `}
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
          className={`
            flex flex-col items-center justify-between
            ${!isMobileMenuOpen ? "w-[100%]" : "w-[100%]"}
            xl:${isCollapsed ? "w-[85%]" : "w-[75%]"}
            h-full p-2 gap-2 border-2 border-dark border-dashed 
            overflow-auto bg-white rounded-3xl
            transition-all
          `}
        >
          <div className="flex flex-col items-center justify-center w-full p-2 gap-2 border-2 border-dark border-dashed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
