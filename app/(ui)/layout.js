"use client";
import { Input } from "@nextui-org/react";
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
} from "@/components/icons/icons";

function MenuHeader({ icons, text }) {
  return (
    <div className="flex items-center justify-center w-full full p-2 gap-2 border-2 border-dark border-dashed">
      <span className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
        {icons}
      </span>
      <span className="xl:flex hidden items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        {text}
      </span>
      <span className="xl:flex hidden items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
        <Down />
      </span>
    </div>
  );
}

export default function UiLayout({ children }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
      <div className="flex flex-row items-center justify-center w-full h-20 p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex flex-row items-center justify-center h-full px-8 py-2 gap-2 border-2 border-danger border-dashed rounded-full bg-white">
          <div className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed ">
            <Cis />
          </div>
          <div className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
            CIS
          </div>
        </div>
        <div className="flex flex-row items-center justify-evenly w-full h-full p-2 gap-2 border-2 border-danger border-dashed rounded-full bg-white">
          <div className="xl:hidden flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Hidden />
          </div>
          <div className="xl:flex hidden items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Company /> Web Cne
          </div>
          <div className="xl:flex hidden items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
            <CneSystem /> Cen System
          </div>
          <div className="xl:flex hidden items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
            <CneCloud /> Cne Cloud
          </div>
          <div className="xl:flex hidden items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
            <LeaveWork /> Leave Work
          </div>
          <div className="xl:flex hidden items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Logo /> Logo
          </div>
          <div className="xl:flex hidden items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Contact /> Contact
          </div>
        </div>
        <div className="flex flex-row items-center justify-center h-full px-8 py-2 gap-2 border-2 border-danger border-dashed rounded-full bg-white">
          <div className="xl:flex hidden items-center justify-center w-60 h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Input
              type="text"
              placeholder="Search"
              size="sm"
              radius="full"
              variant="bordered"
              // startContent={<User />}
              // value={userUsername}
              // onChange={(e) => setUserUsername(e.target.value)}
              // isRequired={true}
            />
          </div>
          <div className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Bell />
          </div>
          <div className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed bg-opacity-50 bg-success">
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
        <div className="flex flex-col items-center justify-between w-full h-full p-2 gap-2 border-2 border-dark border-dashed overflow-auto bg-white rounded-3xl">
          <div className="flex items-center justify-center w-full full p-2 gap-2 border-2 border-dark border-dashed">
            <span className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Hide />
            </span>
          </div>
          <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <MenuHeader icons={<Hr />} text="Human Resources" />
            <MenuHeader icons={<IT />} text="Technology" />
            <MenuHeader icons={<Ac />} text="Account" />
            <MenuHeader icons={<Pu />} text="Purchase" />
          </div>
          <div className="flex items-center justify-center w-full full p-2 gap-2 border-2 border-dark border-dashed">
            <span className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Logout />
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed overflow-auto bg-white rounded-3xl">
          <div className="flex items-center justify-center w-full full p-2 gap-2 border-2 border-dark border-dashed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
