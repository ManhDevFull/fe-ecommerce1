"use client"
import AccordionItem from "@/components/ui/AccordionItem";
import Product from "@/components/ui/Product";
import axios from "axios";
import { min, previousDay } from "date-fns";
import { da } from "date-fns/locale";
import { number } from "framer-motion";
import { div, header, input, object, p, pre } from "framer-motion/client";
import React, { Children, useEffect, useState } from "react"
import { FiMinus } from "react-icons/fi";
import { json } from "stream/consumers";
import { page, category, variants, VariantDTO, Discount, ProductUi, valueFilter, PagedResultDTO } from "../../../types/type";
import { types } from "util";

export default function Filter() {
    const [page, setPage] = useState<page>({
        pageNumber: 1,
        pageSize: 10
    });
    const [variantApi, setVariantApi] = useState<variants[]>([]);
    const [priceError, setPriceError] = useState('')
    const [rangePrice, setRangePrice] = useState({
        min: ''
        , max: ''
    })
    // usestate cho product sau khi lọc
    const [productUi, setProductUi] = useState<PagedResultDTO<ProductUi> | null>(null);

    // ustate cho tiêu chí lọc
    const [selectedFilter, setSelectedFilter] = useState<valueFilter>({
        'brand': ['Anker']
    });

    // lấy các variant để lọc khi bắt đầu truy cập trang
    useEffect(() => {
        const fetchVariantApi = async () => {
            const res = await axios.get('http://localhost:5000/variant');
            console.log('get variant by id', res.data);
            setVariantApi(res.data);
        }
        fetchVariantApi();
    }, []);
    // khi các value lọc bị thay đổi
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
    // giá thay đổi
    const handleApplyPrice = (key: string) => {
        if ((!rangePrice.min && !rangePrice.max)) {
            setPriceError("Vui lòng điền khoảng giá phù hợp !");
            setSelectedFilter(prev => {
                const { price, ...rest } = prev; // xóa key price khi không nhập vào ô in put
                return rest
            });
            return;
        }
        const minprice = parseInt(rangePrice.min, 10) || 0;
        const maxPrice = parseInt(rangePrice.max, 10) || 0;
        if (minprice > maxPrice) {
            setPriceError("Vui lòng điền khoảng giá phù hợp");
            return;
        }
        setPriceError("");
        setSelectedFilter(prev => (
            {
                ...prev,
                [key]: [rangePrice.min || '0', rangePrice.max || '1000000000']
            }
        ));
    }
    // gọi api khi bộ lọc thay đổi
    useEffect(() => {
        const handleSend = async () => {
            try {
                //if (Object.keys(selectedFilter).length === 0)
                    //return;
                const data = await axios.post('http://localhost:5000/product/filter',
                    {
                        filter: selectedFilter,
                        pageNumber: page.pageNumber,
                        pageSize: page.pageSize
                    });
                setProductUi(data.data);
                console.log("product sau khi lọc: ", data.data);
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
            <div className="col-span-3 grid grid-cols-3">
                {/* {
                    productUi?.Items.map((p, index) => (
                        <div>
                            
                        </div>
                    ))
                } */}
            </div>
            <div>
                <ul className="flex gap-3">
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                </ul>
            </div>
        </div>
    )
}