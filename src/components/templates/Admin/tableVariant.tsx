import { IVariant } from "@/types/type";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit3 } from "react-icons/fi";

export default function renderVariant(
  vr: IVariant,
  indexOneBased: number,
  level = 0,
  parentIndex?: string
) {
  const indexStr = parentIndex
    ? `${parentIndex}.${indexOneBased}`
    : `${indexOneBased}`;
  const getBgForLevel = (level: number) => {
    const lightness = Math.max(98 - level * 6, 86);
    return `hsl(0 0% ${lightness}%)`;
  };
  return (
    <div className="w-full">
      <div
        className="text-[#474747] grid grid-cols-22 border-t border-[#00000008] items-center"
        style={{ backgroundColor: getBgForLevel(level + 1) }}
      >
        <div className="text-[#474747] py-2 col-span-1 flex justify-center items-center">
          {indexStr}
        </div>
        <div className="text-[#474747] py-2 col-span-9 pl-1 flex items-center">
          Variant Details
        </div>
        <div className="text-[#474747] py-2 col-span-2 flex justify-center items-center">
          {vr.price}
        </div>
        <div className="text-[#474747] py-2 col-span-3 flex justify-center items-center">
          {vr.inputprice}
        </div>
        <div className="text-[#474747] py-2 col-span-2 flex justify-center items-center">
          {vr.stock}
        </div>
        <div className="text-[#474747] py-2 col-span-2 flex justify-center items-center">
          {vr.stock}
        </div>
        <div className="text-[#474747] py-2 col-span-3 flex items-center">
          <button className="flex items-center hover:text-blue-400 hover:drop-shadow-[0px_4px_4px_rgba(0,255,0,0.55)] duration-300">
            <FiEdit3 />
            <span>Edit</span>
          </button>
          <button className="flex items-center ml-2 text-red-900 hover:text-red-400 hover:drop-shadow-[0px_4px_4px_rgba(255,0,0,0.55)] duration-300">
            <AiTwotoneDelete />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
