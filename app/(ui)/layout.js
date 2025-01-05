"use client";
import { useState, useEffect, useRef } from "react";
import { Input, Tooltip } from "@nextui-org/react";
import { usePathname } from "next/navigation";
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
  Dashboard,
} from "@/components/icons/icons";
import Link from "next/link";

function MenuHeader({ icons, text, href }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed rounded-full ${
        isActive
          ? "bg-opacity-50 bg-default text-success"
          : "bg-white text-dark"
      }`}
      target="blank"
    >
      <span className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
        {icons}
      </span>
      <span className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        {text}
      </span>
    </Link>
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

function MenuSub({ options, isOpen }) {
  const pathname = usePathname();

  return (
    isOpen && (
      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        {options.map((option, index) => {
          const isActive = pathname === option.href;
          return (
            <Link
              key={index}
              href={option.href}
              className={`flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed cursor-pointer ${
                isActive
                  ? "bg-opacity-50 bg-default text-success"
                  : "bg-white text-dark"
              }`}
            >
              {option.label}
            </Link>
          );
        })}
      </div>
    )
  );
}

function MenuMain({ icons, text, isCollapsed, options, isOpen, onToggle }) {
  const pathname = usePathname();
  const isActive = options.some((option) => pathname === option.href);

  const [userTriggered, setUserTriggered] = useState(false);

  useEffect(() => {
    if (isActive && !isOpen && !userTriggered) {
      onToggle();
    }
  }, [pathname, isActive, isOpen, userTriggered, onToggle]);

  const handleMenuClick = () => {
    setUserTriggered(true);
    onToggle();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full full p-2 gap-2 border-2 border-dark border-dashed">
      <div
        className={`flex items-center justify-center w-full gap-2 cursor-pointer ${
          isActive
            ? "bg-opacity-50 bg-default text-success"
            : "bg-white text-dark"
        }`}
        onClick={handleMenuClick}
      >
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
          <span className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            {text}
          </span>
        )}
        {!isCollapsed && (
          <span className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Down />
          </span>
        )}
      </div>
      <MenuSub options={options} isOpen={isOpen} />
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

  const [menuState, setMenuState] = useState({
    HR: false,
    IT: false,
    AC: false,
    PU: false,
  });

  const toggleMenu = (menu) => {
    setMenuState((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
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
        <div className="hidden xl:flex flex-row items-center justify-center h-full px-4 py-2 gap-2 border-2 border-dark border-dashed bg-white rounded-full">
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Cis />
          </div>
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            CIS
          </div>
        </div>
        <div className="hidden xl:flex flex-row items-center justify-between w-full h-full px-4 py-2 gap-2 border-2 border-dark border-dashed bg-white rounded-full">
          <MenuHeaderHide icons={<Hidden />} onClick={toggleHeaderMenu} />
          <MenuHeader
            href="https://channakorn.co.th/"
            icons={<Company />}
            text="Cne"
          />
          <MenuHeader
            href="http://49.0.66.19:8023/Main/"
            icons={<CneSystem />}
            text="System"
          />
          <MenuHeader
            href="http://cnecloud01.myqnapcloud.com:8011/"
            icons={<CneCloud />}
            text="Cloud"
          />
          <MenuHeader
            href="http://49.0.64.242:8088/LoginERS/login.aspx"
            icons={<LeaveWork />}
            text="Day Off"
          />
          <MenuHeader href="/logo" icons={<Logo />} text="Logo" />
          <MenuHeader href="/contact" icons={<Contact />} text="Contact" />
        </div>
        <div className="xl:hidden flex flex-col relative w-full h-full p-2 gap-2 bg-white border-2 border-dark border-dashed rounded-full">
          <MenuHeaderHide icons={<Hidden />} onClick={toggleHeaderMenu} />
          {isMobileHeaderOpen && (
            <div
              className="absolute top-[100%] right-0 flex flex-col items-center justify-center w-[256px] p-2 mt-[20px] gap-2 bg-white border-2 border-dark border-dashed z-50"
              ref={mobileHeaderRef}
            >
              <MenuHeader
                href="https://channakorn.co.th/"
                icons={<Company />}
                text="Cne"
              />
              <MenuHeader
                href="http://49.0.66.19:8023/Main/"
                icons={<CneSystem />}
                text="System"
              />
              <MenuHeader
                href="http://cnecloud01.myqnapcloud.com:8011/"
                icons={<CneCloud />}
                text="Cloud"
              />
              <MenuHeader
                href="http://49.0.64.242:8088/LoginERS/login.aspx"
                icons={<LeaveWork />}
                text="Day Off"
              />
              <MenuHeader href="/logo" icons={<Logo />} text="Logo" />
              <MenuHeader href="/contact" icons={<Contact />} text="Contact" />
            </div>
          )}
        </div>
        <div className="flex flex-row items-center justify-center h-full p-2 xl:px-4 xl:py-2 gap-2 border-2 border-dark border-dashed bg-white rounded-full">
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
            ${isCollapsed ? "xl:w-[10%]" : "xl:w-[25%]"}
            w-[80%] 
            h-full p-2 gap-2 border-2 border-dark border-dashed 
            overflow-auto bg-white rounded-3xl fixed xl:static
            top-0 left-0 z-50
          `}
        >
          <MenuMainOther icons={<Hide />} onClick={handleToggleMenu} />
          <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed overflow-auto">
            <MenuMain
              icons={<Dashboard />}
              text="Dashboard"
              isCollapsed={isCollapsed}
              options={[{ label: "Dashboard", href: "/dashboard" }]}
              isOpen={menuState.Dashboard}
              onToggle={() => toggleMenu("Dashboard")}
            />
            <MenuMain
              icons={<Hr />}
              text="HR Department"
              isCollapsed={isCollapsed}
              options={[
                { label: "Branch", href: "/branch" },
                { label: "Site", href: "/site" },
                { label: "Division", href: "/division" },
              ]}
              isOpen={menuState.HR}
              onToggle={() => toggleMenu("HR")}
            />
            <MenuMain
              icons={<IT />}
              text="IT Department"
              isCollapsed={isCollapsed}
              options={[
                { label: "Backup", href: "/it/backup" },
                { label: "Network", href: "/it/network" },
              ]}
              isOpen={menuState.IT}
              onToggle={() => toggleMenu("IT")}
            />
            <MenuMain
              icons={<Ac />}
              text="AC Department"
              isCollapsed={isCollapsed}
              options={[
                { label: "Option A", href: "/ac/OptionA" },
                { label: "Option B", href: "/ac/OptionB" },
              ]}
              isOpen={menuState.AC}
              onToggle={() => toggleMenu("AC")}
            />
            <MenuMain
              icons={<Pu />}
              text="PU Department"
              isCollapsed={isCollapsed}
              options={[
                { label: "Option C", href: "/pu/OptionC" },
                { label: "Option D", href: "/pu/OptionD" },
              ]}
              isOpen={menuState.PU}
              onToggle={() => toggleMenu("PU")}
            />
          </div>
          <MenuMainOther icons={<Logout />} />
        </div>
        <div
          className={`
            flex flex-col items-center justify-between
            ${!isMobileMenuOpen ? "w-[100%]" : "w-[100%]"}
            xl:${isCollapsed ? "w-[90%]" : "w-[75%]"}
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
