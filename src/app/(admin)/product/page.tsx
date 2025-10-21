"use client";
import { usePathname } from "next/navigation";

export default function ProductPage() {
  const pathname = usePathname();
  const titleProduct = [
    {
      key:0,
      name: ""
    },   {
      key:1,
      name: ""
    },   {
      key:2,
      name: ""
    },   {
      key:3,
      name: ""
    },   {
      key:4,
      name: ""
    },   {
      key:5,
      name: ""
    },   {
      key:6,
      name: ""
    },   {
      key:7,
      name: ""
    },
  ]
  const lastSegment = pathname.split("/").pop();
  return (
    <div className="rounded-lg bg-[#D9D9D940] p-2 shadow-[0px_2px_4px_rgba(0,0,0,0.25)] w-full h-full">
      <h1 className="font-medium text-[26px] mb-2">Products</h1>
      <div className="w-full h-[calc(100%-40px-40px)]">List product</div>
      <div className="w-full h-10 flex justify-center items-center">Navigation</div>
    </div>
  );
}
