"use client";
import Back from "@/components/ui/Back";
import BackNavigation from "@/components/ui/BackNavigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdGrid } from "react-icons/io";
import { MdViewList } from "react-icons/md";

export default function ShowItems(props: {
    type: boolean,
    total: number,
    onSetType: (type: boolean)=> void
}) {
    const {onSetType}= props;
    const {total} = props;
    const [showing, setShowing] = useState('grid');
    const [quantity, setQuantity] = useState(0);
    return (
        <div className="w-full px-4 sm:px-16 py-10">
            <div className="flex items-center gap-28">
                <div className="flex items-center gap-4">
                    <Back/>
                    <p className="text-[18px] font-bold inline-block">All Products</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex gap-2">
                        <IoMdGrid onClick={() => {onSetType(true); setShowing('grid')}} className={`${showing === 'grid' ? 'text-[#1B4B66]' : 'text-[#BBBBBB]'}`} size={showing === 'grid' ? 30 : 28} />
                        <MdViewList onClick={() => {onSetType(false); setShowing('short')}} className={`${showing === 'short' ? 'text-[#1B4B66]' : 'text-[#BBBBBB]'}`} size={showing === 'short' ? 30 : 28} />
                    </div>
                    <p>
                        Showing 1 - 40 of {total} items
                    </p>
                </div>
            </div>
            
        </div>
    )
}