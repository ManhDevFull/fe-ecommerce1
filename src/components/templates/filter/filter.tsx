"use client"
import AccordionItem from "@/components/ui/AccordionItem";
import axios from "axios";
import { min, previousDay } from "date-fns";
import { da } from "date-fns/locale";
import { number } from "framer-motion";
import { div, header, input, object, p, pre } from "framer-motion/client";
import React, { Children, useEffect, useState } from "react"
import { FiMinus } from "react-icons/fi";
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
    const [priceError, setPriceError] = useState('')
    const [rangePrice, setRangePrice] = useState({
        min: ''
        , max: ''
    })
    //xử lý ô input
    const [selectedFilter, setSelectedFilter] = useState<valueFilter>({});
    useEffect(() => {
        // const fetchCategoryApi = async () => {
        //     const res = await axios.get('http://localhost:5000/category/parent');
        //     setCategoryApi(res.data);
        //     console.log(res.data);
        // }
        const fetchVariantApi = async () => {
            const res = await axios.get('http://localhost:5000/variant/1');
            console.log('get variant by id', res.data);
            setVariantApi(res.data);
        }
        fetchVariantApi();
    }, []);
    const handleOnchange = (key: string, value: string) => {
        setSelectedFilter(prev => {
            const currentValues = prev[key] || [];
            const newValues = currentValues.includes(value) ? currentValues.filter(v => v != value) : [...currentValues, value];
            if (newValues.length == 0) {
                const { [key]: _, ...rest } = prev; // bỏ qua key
                return rest;
            }

            return {
                ...prev,
                [key]: newValues,
            };
        });
    }
    const handleApplyPrice = (key: string) => {
        if (!rangePrice.min && !rangePrice.max) {
            setPriceError("Vui lòng điền khoảng giá phù hợp !");
            setSelectedFilter(prev => {
                const { price, ...rest } = prev; // xóa key price khi không nhập vào ô in put
                return rest
            });
        }
        else {
            setPriceError("");
            setSelectedFilter(prev => (
                {
                    ...prev,
                    [key]: [rangePrice.min || '0', rangePrice.max || '1000000000']
                }
            ));
        }
    }
    useEffect(() => {
        const handleSend = async () => {
            if (Object.keys(selectedFilter).length === 0)
                return;
            const data = await axios.post('http://localhost:5000/product/filter', { filter: selectedFilter }); //bug
            console.log("product sau khi lọc: ", data.data);
            try {
                // const data = await axios.post('http://localhost:5000/variant/filter', { filter: selectedFilter })
                // console.log('data sau khi lọc: ', data.data); done
            }
            catch (error: any) {
                if (error.response) {
                    // Server trả về lỗi
                    console.error('Lỗi từ server:', error.response.data);
                    console.error('Status code:', error.response.status);
                } else if (error.request) {
                    // Không nhận được phản hồi từ server
                    console.error('Không nhận được phản hồi từ server:', error.request);
                } else {
                    // Lỗi khác
                    console.error('Lỗi không xác định:', error.message);
                }
            }
            // console.log('res data filter: ', data.data);
        }
        handleSend();
    }, [selectedFilter]);
    console.log('selected filter: ', selectedFilter);
    return (
        <div className="w-full px-4 sm:px-16 py-10 grid grid-cols-4">
            <div className="col-span-1">
                {
                    variantApi.map((variant, index) => (
                        <AccordionItem key={index} title={variant.key}>
                            {
                                variant.key === "price" ?
                                    (<div className="w-full pr-4">
                                        <p className="py-2 text-start">Khoảng giá</p>
                                        <div className="flex gap-2 w-full">
                                            <input
                                                onChange={(e) => setRangePrice(prev => (
                                                    {
                                                        ...prev,
                                                        min: e.target.value
                                                    }
                                                ))}
                                                className=" px-2 w-full border-[1px] border-[##626262]"
                                                type="text" name="minPrice"
                                                placeholder="$ Từ" />
                                            <FiMinus size={30} />
                                            <input
                                                onChange={(e) => setRangePrice(prev => (
                                                    {
                                                        ...prev,
                                                        max: e.target.value
                                                    }
                                                ))}
                                                className="px-2 w-full border-[1px] border-[##626262]"
                                                type="text" name="maxPrice" placeholder="$ Đến" />
                                        </div>
                                        {priceError && <p className="text-red-500 py-[20px]">{priceError}</p>}
                                        <button
                                            onClick={() => handleApplyPrice(variant.key)}
                                            className="w-full hover:cursor-pointer px-2 bg-green-500 py-2 mt-2 rounded-[10px] text-white"
                                            type="submit">Áp dụng</button>
                                    </div>) : (
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
                                        )))
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