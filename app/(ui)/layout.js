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
      <span>{icons}</span>
      <span>{text}</span>
    </div>
  );
}

function MenuHeaderHide({ icons, text }) {
  return (
    <div className="xl:hidden flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
      <span>{icons}</span>
      <span>{text}</span>
    </div>
  );
}

function MenuMain({ icons, text, isCollapsed }) {
  return (
    <div className="flex items-center justify-center w-full p-2 gap-2 border-2 border-dark border-dashed">
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
        <span>{icons}</span>
      </Tooltip>
      {!isCollapsed && (
        <>
          <span className="flex-1">{text}</span>
          <span>
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
      className="flex items-center justify-center w-full p-2 gap-2 border-2 border-dark border-dashed cursor-pointer"
      onClick={onClick}
    >
      <span>{icons}</span>
    </div>
  );
}

export default function UiLayout({ children }) {
  // สอง State ที่เราจะใช้
  const [isCollapsed, setIsCollapsed] = useState(false);    // สำหรับย่อ/ขยายเมนู (ฝั่ง Desktop)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // สำหรับเปิด/ปิดเมนู (ฝั่ง Mobile)

  const handleToggleMenu = () => {
    setIsCollapsed((prev) => !prev);
  };

  // กดปุ่ม CIS เพื่อเปิด/ปิด Mobile Menu
  const handleOpenMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

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

        {/* 
          Side Menu 
          - จอใหญ่ (xl ขึ้นไป): ให้เป็น Sidebar ปกติ (ใช้ isCollapsed ควบคุมความกว้าง)
          - จอเล็ก: ซ่อนเป็นค่าเริ่มต้น ถ้ากดปุ่ม Cis จะให้โผล่เต็มความกว้างที่เราต้องการ
        */}
        <div
          className={`
            // ซ่อนบนจอเล็ก ถ้า isMobileMenuOpen === false
            ${isMobileMenuOpen ? "flex" : "hidden"}
            // แต่ถ้าเป็นจอใหญ่ xl ให้โชว์ตลอด (flex)
            xl:flex 
            flex-col items-center justify-between
            // กำหนดความกว้าง desktop
            ${isCollapsed ? "xl:w-[10%]" : "xl:w-[20%]"}
            // ถ้าเป็น mobile แล้วเปิดเมนู ใช้ขนาดกว้างสัก 80% (หรือ 100% ตามต้องการ)
            w-[35%] 
            h-full p-2 gap-2 border-2 border-dark border-dashed 
            overflow-auto bg-white rounded-3xl fixed xl:static
            top-0 left-0 z-50
          `}
        >
          <MenuMainOther icons={<Hide />} onClick={handleToggleMenu} />
          <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <MenuMain icons={<Hr />} text="HR Department" isCollapsed={isCollapsed} />
            <MenuMain icons={<IT />} text="IT Department" isCollapsed={isCollapsed} />
            <MenuMain icons={<Ac />} text="AC Department" isCollapsed={isCollapsed} />
            <MenuMain icons={<Pu />} text="PU Department" isCollapsed={isCollapsed} />
          </div>
          <MenuMainOther icons={<Logout />} />
        </div>

        {/* ส่วน Main Content
            - ถ้าเป็นจอเล็ก (Mobile) และเมนูถูกปิด => ให้เต็ม 100%
            - ถ้าเป็นจอใหญ่ (xl) => ใช้เงื่อนไขแสดงตาม isCollapsed
        */}
        <div
          className={`
            flex flex-col items-center justify-between
            // ถ้าบนจอเล็ก แต่เมนูไม่เปิด => w-full
            ${!isMobileMenuOpen ? "w-[100%]" : "w-0"}
            // ส่วนบนจอใหญ่ก็ให้เป็นแบบเดิม (80% หรือ 90%)
            xl:${isCollapsed ? "w-[90%]" : "w-[80%]"}
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
