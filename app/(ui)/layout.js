"use client";
import { useState, useEffect, useRef } from "react";
import { Input, Tooltip } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import toast, { Toaster } from "react-hot-toast";
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
  Record,
  En,
  Setting,
} from "@/components/icons/icons";

function MenuHeader({ icons, text, href }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed  ${
        isActive ? "  text-success" : "bg-white text-dark"
      }`}
      target="_blank"
    >
      <span className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed ">
        {icons}
      </span>
      <span className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed ">
        {text}
      </span>
    </Link>
  );
}

function MenuHeaderHide({ icons, onClick }) {
  return (
    <div
      className="xl:hidden flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed "
      onClick={onClick}
    >
      <span className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed ">
        {icons}
      </span>
    </div>
  );
}

function MenuSub({ options, isOpen, isCollapsed }) {
  const pathname = usePathname();

  return (
    isOpen && (
      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed ">
        {options.map((option, index) => {
          const isActive =
            pathname === option.href || pathname.startsWith(option.href);
          return (
            <Link
              key={index}
              href={option.href}
              className={`flex items-center justify-start w-full h-full px-4 py-2 gap-2 border-2 border-dark border-dashed  ${
                isActive ? "text-success" : "bg-white text-dark"
              }`}
            >
              <Record />
              {isCollapsed ? (
                <Tooltip
                  content={option.label}
                  size="lg"
                  color="success"
                  radius="lg"
                  shadow="lg"
                  placement="right"
                  showArrow={true}
                  delay={100}
                >
                  {option.label.charAt(0).toUpperCase()}
                </Tooltip>
              ) : (
                option.label
              )}
            </Link>
          );
        })}
      </div>
    )
  );
}

function MenuMain({ icons, text, isCollapsed, options, isOpen, onToggle }) {
  const pathname = usePathname();
  const isActive = options.some(
    (option) => pathname === option.href || pathname.startsWith(option.href)
  );
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
    <div className="flex flex-col items-center justify-center w-full full p-2 gap-2 border-2 border-dark border-dashed cursor-pointer">
      <div
        className={`flex items-center justify-center w-full p-2 gap-2 border-2 border-dark border-dashed ${
          isActive ? "  text-success" : "bg-white text-dark"
        }`}
        onClick={handleMenuClick}
      >
        <Tooltip
          content={isCollapsed ? text : ""}
          size="lg"
          color="success"
          radius="lg"
          shadow="lg"
          placement="right"
          showArrow={true}
          delay={100}
        >
          <span className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed ">
            {icons}
          </span>
        </Tooltip>
        {!isCollapsed && (
          <span className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed ">
            {text}
          </span>
        )}
        {!isCollapsed && (
          <span className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed ">
            <Down />
          </span>
        )}
      </div>
      <MenuSub options={options} isOpen={isOpen} isCollapsed={isCollapsed} />
    </div>
  );
}
function MenuMainOther({ icons, text, onClick, isCollapsed }) {
  return (
    <div
      className="flex items-center justify-center w-full full p-2 gap-2 border-2 border-dark border-dashed cursor-pointer"
      onClick={onClick}
    >
      <span className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed ">
        {icons}
      </span>
      {!isCollapsed && (
        <span className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed  font-[600]">
          {text}
        </span>
      )}
    </div>
  );
}

export default function UiLayout({ children }) {
  const { data: session, status } = useSession();
  const userData = session?.user || {};
  const router = useRouter();

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
    Dashboard: false,
    HR: false,
    IT: false,
    AC: false,
    PU: false,
    EN: false,
    SETTING: false,
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

  useEffect(() => {
    if (!session && status !== "loading") {
      toast.error("Please log in before making a transaction", {
        duration: 1000,
      });
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <Loading />
      </div>
    );
  }

  if (!session) {
    return null;
  }
  return (
    <>
      <Toaster position="top-right" />
      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex flex-row items-center justify-between w-full h-20 p-2 gap-4 border-2 border-dark border-dashed">
          <div
            className="xl:hidden flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed bg-white rounded-full"
            onClick={handleOpenMobileMenu}
          >
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Cis />
            </div>
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed font-[600] text-xl text-success">
              CIS
            </div>
          </div>
          <div className="hidden xl:flex flex-row items-center justify-center h-full px-4 py-2 gap-2 border-2 border-dark border-dashed bg-white rounded-full">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Cis />
            </div>
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed font-[600] text-xl text-success">
              CIS
            </div>
          </div>
          <div className="hidden xl:flex flex-row items-center justify-between w-full h-full px-4 py-2 gap-2 border-2 border-dark border-dashed  bg-white rounded-full">
            <MenuHeaderHide icons={<Hidden />} onClick={toggleHeaderMenu} />
            <MenuHeader
              href="https://channakorn.co.th/"
              icons={<Company />}
              text="Cne"
              target="_blank"
            />
            <MenuHeader
              href="http://49.0.66.19:8023/Main/"
              icons={<CneSystem />}
              text="System"
              target="_blank"
            />
            <MenuHeader
              href="http://cnecloud01.myqnapcloud.com:8011/"
              icons={<CneCloud />}
              text="Cloud"
              target="_blank"
            />
            <MenuHeader
              href="http://49.0.64.242:8088/LoginERS/login.aspx"
              icons={<LeaveWork />}
              text="Day Off"
              target="_blank"
            />
            <MenuHeader
              href="/logo"
              icons={<Logo />}
              text="Logo"
              target="_blank"
            />
            <MenuHeader
              href="/contact"
              icons={<Contact />}
              text="Contact"
              target="_blank"
            />
          </div>
          <div className="xl:hidden flex flex-col relative w-full h-full p-2 gap-2 border-2 border-dark border-dashed bg-white  rounded-full">
            <MenuHeaderHide icons={<Hidden />} onClick={toggleHeaderMenu} />
            {isMobileHeaderOpen && (
              <div
                className="absolute top-[100%] right-0 flex flex-col items-center justify-center w-[256px] p-2 mt-[20px] gap-2 border-2 border-dark border-dashed bg-white  z-50"
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
                <MenuHeader
                  href="/contact"
                  icons={<Contact />}
                  text="Contact"
                />
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
            <MenuMainOther
              icons={<Hide />}
              text={`${userData.employee?.employeeFirstnameTH || ""} ${
                userData.employee?.employeeLastnameTH || ""
              } `}
              isCollapsed={isCollapsed}
              onClick={handleToggleMenu}
            />
            <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed  overflow-auto">
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
                text="HR Dep"
                isCollapsed={isCollapsed}
                options={[
                  { label: "Branch", href: "/branch" },
                  { label: "Role", href: "/role" },
                  { label: "Site", href: "/site" },
                  { label: "Division", href: "/division" },
                  { label: "Department", href: "/department" },
                  { label: "Position", href: "/position" },
                  { label: "Employee", href: "/employee" },
                  { label: "PersonalRequest", href: "/personalRequest" },
                  { label: "Transfer", href: "/employmentTransfer" },
                  { label: "Training", href: "/training" },
                ]}
                isOpen={menuState.HR}
                onToggle={() => toggleMenu("HR")}
              />
              {/* <MenuMain
                icons={<IT />}
                text="IT Dep"
                isCollapsed={isCollapsed}
                options={[
                  { label: "Backup", href: "/backup" },
                  { label: "Network", href: "/network" },
                ]}
                isOpen={menuState.IT}
                onToggle={() => toggleMenu("IT")}
              />
              <MenuMain
                icons={<Ac />}
                text="AC Dep"
                isCollapsed={isCollapsed}
                options={[
                  { label: "Option A", href: "/OptionA" },
                  { label: "Option B", href: "/OptionB" },
                ]}
                isOpen={menuState.AC}
                onToggle={() => toggleMenu("AC")}
              />
              <MenuMain
                icons={<Pu />}
                text="PU Dep"
                isCollapsed={isCollapsed}
                options={[
                  { label: "Option C", href: "/OptionC" },
                  { label: "Option D", href: "/OptionD" },
                ]}
                isOpen={menuState.PU}
                onToggle={() => toggleMenu("PU")}
              />
              <MenuMain
                icons={<En />}
                text="EN Dep"
                isCollapsed={isCollapsed}
                options={[
                  { label: "Option E", href: "/OptionE" },
                  { label: "Option F", href: "/OptionF" },
                ]}
                isOpen={menuState.EN}
                onToggle={() => toggleMenu("EN")}
              />
              <MenuMain
                icons={<Setting />}
                text="Setting"
                isCollapsed={isCollapsed}
                options={[
                  { label: "Option G", href: "/OptionG" },
                  { label: "Option H", href: "/OptionH" },
                ]}
                isOpen={menuState.SETTING}
                onToggle={() => toggleMenu("SETTING")}
              /> */}
            </div>
            <MenuMainOther
              icons={<Logout />}
              text="Logout"
              isCollapsed={isCollapsed}
              onClick={() => {
                signOut({
                  callbackUrl: "/",
                });
              }}
            />
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
            <div className="flex flex-col items-center justify-center w-full p-2 gap-2 border-2 border-dark border-dashed ">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
