"use client";
import TopicHeader from "@/components/form/TopicHeader";
import Link from "next/link";
import React from "react";
import { Input, Button } from "@nextui-org/react";
import { Add, Search } from "@/components/icons/icons";

export default function BranchPage() {
  return (
    <>
      <TopicHeader topic="BranchPage" />
      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Input
              type="text"
              placeholder="Search"
              size="lg"
              variant="bordered"
              startContent={<Search />}
              // value={userUsername}
              // onChange={(e) => setUserUsername(e.target.value)}
              // isRequired={true}
            />
          </div>
          <Link
            href="/branch/create"
            className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed"
          >
            <Button size="lg" color="primary">
              <Add /> Add New
            </Button>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <div className="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              Total Row
            </div>
            <div className="flex items-center justify-end w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              Select Row Show
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <div className="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                Header Table 1
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                Header Table 2
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                Header Table 3
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                Header Table 4
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                Header Table 5
              </div>
            </div>
            <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <div className="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  Body Table 1
                </div>
                <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  Body Table 2
                </div>
                <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  Body Table 3
                </div>
                <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  Body Table 4
                </div>
                <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  Body Table 5
                </div>
              </div>
              <div className="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  Body Table 1
                </div>
                <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  Body Table 2
                </div>
                <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  Body Table 3
                </div>
                <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  Body Table 4
                </div>
                <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  Body Table 5
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              xxx Row Form xxx Row
            </div>
            <div className="flex items-center justify-end w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              Paginations
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
