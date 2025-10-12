"use client";
import handleAPI from "@/axios/handleAPI";
import ActionMenu from "@/components/ui/AvtionMenu";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductPage() {
  const pathname = usePathname();
  const titleProduct = [
    {
      key: 0,
      name: "",
    },
    {
      key: 1,
      name: "",
    },
    {
      key: 2,
      name: "",
    },
    {
      key: 3,
      name: "",
    },
    {
      key: 4,
      name: "",
    },
    {
      key: 5,
      name: "",
    },
    {
      key: 6,
      name: "",
    },
    {
      key: 7,
      name: "",
    },
  ];
  const lastSegment = pathname.split("/").pop();
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getProduct = async () => {
      const api = "/admin/Product?page=1&size=10";
      try {
        const res = await handleAPI(api);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, []);
  return (
    <div className="rounded-lg bg-[#D9D9D940] p-2 shadow-[0px_2px_4px_rgba(0,0,0,0.25)] w-full h-full flex flex-col">
      <h1 className="font-medium text-[26px] mb-2">Products</h1>
      <div className="grid grid-cols-24 border-t border-gray-200 shadow overflow-hidden">
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-1 text-center">
          #
        </div>
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-7 pl-1">
          Product name
        </div>
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-2 text-center">
          Brand
        </div>
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-3 text-center">
          Category
        </div>
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-2 text-center">
          Stock
        </div>
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-7">
          Images
        </div>
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-2 text-center">
          Action
        </div>
      </div>
      <div
        className="flex-grow overflow-y-auto bg-[#ffffff80]  scrollbar-hidden"
        style={{ maxHeight: "calc(100vh - 250px)" }}
      >
        {Array.from({ length: 10 }).map((_, idx) => (
          <div
            key={idx}
            className="grid grid-cols-24 h-13 border-t border-gray-200"
          >
            <div className="text-[#474747] py-2 col-span-1 flex justify-center items-center">
              {idx}
            </div>
            <div className="text-[#474747] py-2 col-span-7 pl-1 flex justify-center items-center">
              Product name
            </div>
            <div className="text-[#474747] py-2 col-span-2 flex justify-center items-center">
              Brand
            </div>
            <div className="text-[#474747] py-2 col-span-3 flex justify-center items-center">
              Headphone
            </div>
            <div className="text-[#474747] py-2 col-span-2 flex justify-center items-center">
              189
            </div>
            <div className="text-[#474747] py-2 col-span-7 flex items-center overflow-hidden overflow-x-auto scrollbar-hidden">
              ImagesImagesImagesImagesImagesImagesImagesImagesImagesImagesImagesImages
            </div>
            <div className="text-[#474747] py-2 col-span-2 flex items-center justify-center">
              <ActionMenu
                onView={() => console.log("view")}
                onEdit={() => console.log("edit")}
                onDelete={() => console.log("del")}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="w-full h-10 flex justify-center items-center">
        Navigation
      </div>
    </div>
  );
}
