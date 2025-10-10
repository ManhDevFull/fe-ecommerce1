"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CategoryTree, ICategory } from "@/types/type"
import { AiTwotoneDelete } from "react-icons/ai"
import { CiEdit } from "react-icons/ci"
import { IoIosAddCircleOutline } from "react-icons/io"


export default function CateAction(props: { data: CategoryTree }) {
  const { data } = props

  return (
    <TooltipProvider>
      <div className="flex h-full items-center gap-3">
        {/* Edit icon */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="hover:text-blue-500 hover:drop-shadow-[0px_4px_4px_rgba(0,0,255,0.55)]">
              <CiEdit size={25} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Edit</TooltipContent>
        </Tooltip>

        {/* Delete icon */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="hover:text-red-400 hover:drop-shadow-[0px_4px_4px_rgba(255,0,0,0.55)] ">
              <AiTwotoneDelete size={23} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Delete</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="hover:text-green-400 hover:drop-shadow-[0px_4px_4px_rgba(0,255,0,0.55)] ">
              <IoIosAddCircleOutline size={23} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Add subcategory</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

// Add subcategory
