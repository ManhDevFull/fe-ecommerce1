"use client";
import React, { useEffect, useState } from "react";
import { formatTree } from "@/app/utils/formartTree";
import handleAPI from "@/axios/handleAPI";
import CateAction from "@/components/templates/Admin/CategoryAction";
import PlusMinusIcon from "@/components/ui/PlusMinusIcon";
import { CategoryTree } from "@/types/type";
import Collapse from "@/components/ui/collapse";

export default function CategoryPage() {
  const [listCate, setListCate] = useState<CategoryTree[]>([]);
  const [openIds, setOpenIds] = useState<number[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await handleAPI("/admin/category");
        if (res.status === 200) {
          const newCateList = formatTree(res.data);
          setListCate(newCateList);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);

  const toggleOpen = (id: number) =>
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const getBgForLevel = (level: number) => {
    const lightness = Math.max(98 - level * 6, 86);
    return `hsl(0 0% ${lightness}%)`;
  };

  const renderCategory = (
    cate: CategoryTree,
    indexOneBased: number,
    level = 0,
    parentIndex?: string
  ) => {
    const indexStr = parentIndex ? `${parentIndex}.${indexOneBased}` : `${indexOneBased}`;
    const isOpen = openIds.includes(cate.id);

    return (
      <div key={`node-${cate.id}`} className="col-span-24">
        <div
          className="text-[#474747] col-span-24 grid grid-cols-24 py-3 border-t border-[#00000008] items-center"
          style={{ backgroundColor: getBgForLevel(level) }}
        >
          <div className="col-span-2 text-center">{indexStr}</div>

          <div
            className="col-span-11 flex items-center cursor-pointer select-none"
            onClick={() => {
              if (cate.children && cate.children.length > 0) {
                toggleOpen(cate.id);
              }
            }}
          >
            {cate.children && cate.children.length > 0 && <PlusMinusIcon isOpen={isOpen} />}
            <span>{cate.namecategory}</span>
          </div>

          <div className="col-span-7 text-center">{cate.product}</div>
          <div className="col-span-4">
            <CateAction data={cate} />
          </div>
        </div>

        {cate.children && cate.children.length > 0 && (
          <Collapse isOpen={isOpen} duration={260}>
            <div>
              {cate.children.map((child, i) =>
                renderCategory(child, i + 1, level + 1, indexStr)
              )}
            </div>
          </Collapse>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-lg bg-[#D9D9D940] p-2 shadow-[0px_2px_4px_rgba(0,0,0,0.25)] w-full h-full">
      <h1 className="font-medium text-[26px] mb-2">Category</h1>

      <div className="grid grid-cols-24 border-t border-gray-200 shadow rounded-b-md overflow-hidden">
        {/* header */}
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-2 text-center">#</div>
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-11 pl-1">Category name</div>
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-7 text-center">
          Number of products
        </div>
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-4">Action</div>

        {/* body */}
        {listCate.length === 0 ? (
          <div className="col-span-24 text-center text-[#474747] py-3 bg-[#ffffff70]">
            There are no categories.
          </div>
        ) : (
          listCate.map((cate, i) => renderCategory(cate, i + 1))
        )}
      </div>
    </div>
  );
}
