"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AiOutlineProduct, AiTwotoneCopyrightCircle } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { IoIosArrowDown } from "react-icons/io";
import { IoTicketOutline } from "react-icons/io5";
import { LiaPaypal } from "react-icons/lia";
import { MdOutlineInventory, MdOutlineRateReview } from "react-icons/md";
import { PiPackageDuotone } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
import { TbMessageReport } from "react-icons/tb";

interface Props {
  className?: string;
}

export default function SiderAdminComponent({ className }: Props) {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").pop();
  const route = useRouter();

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const categories = [
    { key: "dashboard", name: "Dashboard", icon: <RxDashboard /> },
    {
      key: "categoryAndProduct",
      name: "Product Management",
      icon: <AiOutlineProduct />,
      children: [
        { key: "product", name: "Product" },
        { key: "category", name: "Category" },
      ],
    },
    { key: "order", name: "Order Management", icon: <PiPackageDuotone /> },
    {
      key: "customer",
      name: "Customer Management",
      icon: <HiOutlineUserGroup />,
    },
    { key: "review", name: "Review & Ratings", icon: <MdOutlineRateReview /> },
    {
      key: "analytics",
      name: "Analytics & Reports",
      icon: <TbMessageReport />,
    },
    {
      key: "marketing",
      name: "Marketing & Promotion",
      icon: <IoTicketOutline />,
    },
    {
      key: "inventory",
      name: "Inventory & Warehouse",
      icon: <MdOutlineInventory />,
    },
    { key: "payment", name: "Payment & Transactions", icon: <LiaPaypal /> },
  ];

  return (
    <div
      className={`flex flex-col justify-between h-[calc(100vh-70px)] bg-[#D9D9D940] p-4 ${className}`}
    >
      <div className="bg-white rounded-lg h-[calc(100%-40px)] p-4 overflow-y-auto">
        {categories.map((cate) => {
          const isActiveParent = lastSegment === cate.key;
          const isExpanded = expandedKeys.includes(cate.key);

          return (
            <div key={cate.key} className="mb-2">
              {/* Parent item */}
              <div
                onClick={() => {
                  if (cate.children) {
                    toggleExpand(cate.key);
                  } else {
                    route.push("/" + cate.key);
                  }
                }}
                className={`cursor-pointer flex justify-between items-center h-12 px-3 rounded-lg transition-all
                  ${
                    isActiveParent
                      ? "bg-[#00000030] shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]"
                      : "bg-[#B7B7B720] shadow-[0px_4px_4px_rgba(0,0,0,0.2)]"
                  }`}
              >
                <div className="flex items-center">
                  <span className="text-[22px] text-gray-900">{cate.icon}</span>
                  <p className="ml-2">{cate.name}</p>
                </div>
                {cate.children && (
                  <IoIosArrowDown
                    size={20}
                    className={`transform transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : "rotate-0"
                    }`}
                  />
                )}
              </div>

              <div
                className={`transition-all duration-500 ease-in-out
                  ${
                    isExpanded
                      ? "max-h-40 opacity-100 translate-y-0 pointer-events-auto"
                      : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
                  }`}
              >
                {cate.children && (
                  <div className="px-2 py-2 rounded-lg overflow-hidden bg-[#F8F8F878] shadow-[0px_4px_4px_rgba(0,0,0,0.2)] space-y-1">
                    {cate.children.map((child, index) => {
                      const isActiveChild = lastSegment === child.key;
                      return (
                        <div key={child.key} className="relative">
                          {index !== 0 && (
                            <hr className="absolute w-full h-[0.5px] text-gray-200 -top-0.5 left-0 -translate-y-1/2" />
                          )}
                          <div
                            onClick={() => route.push("/" + child.key)}
                            className={`cursor-pointer rounded-md px-2 py-1 transition-all
                            ${
                              isActiveChild
                                ? "bg-[#00000025]"
                                : "hover:bg-[#00000010]"
                            } overflow-hidden`}
                          >
                            {child.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center text-sm text-gray-600 mt-3">
        <AiTwotoneCopyrightCircle size={16} />
        <p className="ml-1">2025 Vertex Dev. All rights reserved.</p>
      </div>
    </div>
  );
}
