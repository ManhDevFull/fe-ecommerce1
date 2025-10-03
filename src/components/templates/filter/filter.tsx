"use client"
import AccordionItem from "@/components/ui/AccordionItem";
import axios from "axios";
import { header } from "framer-motion/client";
import React, { Children, useEffect, useState } from "react"
import { json } from "stream/consumers";
type category = {
    _id: number;
    name_category: string;
}
type variants = {
    key: string;
    values: string[];
}
type valueFilter = {
    [key: string]: string[];
}
export default function Filter() {
    const [categoryApi, setCategoryApi] = useState<category[]>([]);
    const [sizeAPI, setSizeApi] = useState<category[]>([]);
    const [variantApi, setVariantApi] = useState<variants[]>([]);
    //xử lý ô input
    const [selectedFilter, setSelectedFilter] = useState<valueFilter>({});
    useEffect(() => {
        const fetchCategoryApi = async () => {
            const res = await axios.get('http://localhost:5000/category/parent');
            setCategoryApi(res.data);
            console.log(res.data);
        }
        const fetchVariantApi = async () => {
            const res = await axios.get('http://localhost:5000/variant/1');
            setVariantApi(res.data);
            console.log(res.data);
        }
        fetchVariantApi();
    }, []);
    const handleOnchange = (key: string, value: string) => {
        setSelectedFilter(prev => {
            const currentValues = prev[key] || [];
            return {
                ...prev,
                [key]: currentValues.includes(value) ? currentValues.filter(v => v != value) : [...currentValues, value]
            }
        });
    }
    useEffect(() => {
        console.log(selectedFilter);
        const handleSend = async ()=>{
            const data = await axios.post('http://localhost:5000/variant', {filter: selectedFilter});
            console.log('hello' + data.data);
        }
        handleSend();
    }, [selectedFilter]);
    return (
        <div className="w-full px-4 sm:px-16 py-10 grid grid-cols-4">
            <div className="col-span-1">
                {
                    variantApi.map((variant, index) => (
                        <AccordionItem key={index} title={variant.key}>
                            {
                                variant.values.map((value, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            checked={Array.isArray(selectedFilter[variant.key])
                                                ? selectedFilter[variant.key].includes(value)
                                                : false}
                                            onChange={() => handleOnchange(variant.key, value)}
                                            className="w-[15px] h-[15px]"
                                        />

                                        <p className="text-[20px]">{value}</p>
                                    </div>
                                ))
                            }
                        </AccordionItem>
                    ))
                }
            </div>
            <div className="col-span-3">
                danh sách sản phẩm trả về khi lọc
            </div>
        </div>
    )
}