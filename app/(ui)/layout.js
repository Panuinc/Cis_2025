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
  // State สำหรับย่อ/ขยายเมนู (ฝั่ง Desktop)
  const [isCollapsed, setIsCollapsed] = useState(false);

  // State สำหรับเปิด/ปิดเมนู (ฝั่ง Mobile)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // สร้าง ref สำหรับจับ DOM ของ Side Menu
  const sideMenuRef = useRef(null);

  // ฟังก์ชันสำหรับคลิกปุ่มย่อ/ขยาย (Desktop)
  const handleToggleMenu = () => {
    setIsCollapsed((prev) => !prev);
  };

  // ฟังก์ชันสำหรับกดปุ่ม CIS เพื่อเปิด/ปิด Mobile Menu
  const handleOpenMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // ดักฟังการคลิกนอก Side Menu เพื่อหุบเมนู (บน Mobile)
  useEffect(() => {
    function handleClickOutside(event) {
      // ถ้าเมนูเปิดอยู่ + sideMenuRef มีค่า + คลิกนอก sideMenuRef => หุบเมนู
      if (
        isMobileMenuOpen &&
        sideMenuRef.current &&
        !sideMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
      {/* --------------------- Header --------------------- */}
      <div className="flex flex-row items-center justify-between w-full h-20 p-2 gap-4 border-2 border-dark border-dashed">
        {/* ปุ่ม Cis ไว้ด้านซ้ายสุด เพื่อกดเปิด Mobile Menu */}
        <div
          className="flex items-center justify-center h-full px-4 gap-2 border-2 border-dark border-dashed bg-white rounded-full cursor-pointer xl:hidden"
          onClick={handleOpenMobileMenu}
        >
          <Cis />
          <span>CIS</span>
        </div>

        {/* กรอบโลโก้ CIS แบบเดิม (แสดงเฉพาะจอใหญ่) */}
        <div className="hidden xl:flex flex-row items-center justify-center h-full px-8 py-2 gap-2 border-2 border-dark border-dashed bg-white rounded-full">
          <div className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed ">
            <Cis />
          </div>
          <div>CIS</div>
        </div>

        {/* Menu Header (บริษัท / system / cloud / ... ) */}
        <div className="flex flex-row items-center justify-between w-full h-full px-8 py-2 gap-2 border-2 border-dark border-dashed bg-white rounded-full">
          <MenuHeaderHide icons={<Hidden />} text="Hide" />
          <MenuHeader icons={<Company />} text="Cne" />
          <MenuHeader icons={<CneSystem />} text="System" />
          <MenuHeader icons={<CneCloud />} text="Cloud" />
          <MenuHeader icons={<LeaveWork />} text="Day Off" />
          <MenuHeader icons={<Logo />} text="Logo" />
          <MenuHeader icons={<Contact />} text="Contact" />
        </div>

        {/* ส่วน Notification / Avatar */}
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
      {/* --------------------- /Header --------------------- */}

      {/* --------------------- Content (Main + Sidebar) --------------------- */}
      <div className="flex flex-row items-start justify-center w-full h-full p-2 gap-6 border-2 border-dark border-dashed overflow-auto">
        {/* Side Menu */}
        <div
          ref={sideMenuRef}
          className={`
            // ซ่อนบนจอเล็ก ถ้า isMobileMenuOpen === false
            ${isMobileMenuOpen ? "flex" : "hidden"}
            // แต่ถ้าเป็นจอใหญ่ xl ให้โชว์ตลอด (flex)
            xl:flex 
            flex-col items-center justify-between
            // กำหนดความกว้าง desktop
            ${isCollapsed ? "xl:w-[15%]" : "xl:w-[25%]"}
            // ถ้าเป็น mobile แล้วเปิดเมนู ใช้ขนาดกว้างตามต้องการ (ตัวอย่าง 35%)
            w-[30%] 
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

        {/* ส่วน Main Content */}
        <div
          className={`
            flex flex-col items-center justify-between
            // ถ้าบนจอเล็ก แต่เมนูไม่เปิด => w-full
            ${!isMobileMenuOpen ? "w-[100%]" : "w-0"}
            // ส่วนบนจอใหญ่ => ใช้เงื่อนไขแสดงตาม isCollapsed
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
      {/* --------------------- /Content --------------------- */}
    </div>
  );
}
