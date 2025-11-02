"use client"
import AccordionItem from "@/components/ui/AccordionItem";
import Product from "@/components/ui/Product";
import axios from "axios";
import { min, previousDay } from "date-fns";
import { da } from "date-fns/locale";
import { number } from "framer-motion";
import { div, header, input, object, p, param, pre } from "framer-motion/client";
import React, { Children, useEffect, useState } from "react"
import { FiMinus } from "react-icons/fi";
import { json } from "stream/consumers";
import { page, category, variants, VariantDTO, ProductUi, valueFilter, PagedResultDTO, allvariant } from "../../../types/type";
import { types } from "util";
import { title } from "process";
import { VscLaw } from "react-icons/vsc";
import { UserSearch } from "iconsax-react";

export default function Filter() {
    const [page, setPage] = useState<page>({
        pageNumber: 1,
        pageSize: 9
    });
    // lưu variant khi category thay đổi
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
    });
    // lấy tất cả category khi load trang, category này luôn giữ nguyên cố định
    type allcategory = {
        key: string;
        values: string[];
    }
    // useState cho variant khi bắt đầu load trang
    const [allVariant, setAllVariant] = useState<allvariant[] | null>(null);
    // useState cho tên của tất cả các category, luôn cố định khi load trang
    const [getAllcategory, setGetAllCategory] = useState<allcategory>();
    // lấy tên ra category khi bắt đầu load trang(không thay đổi)
    // lấy ra tất cả variant khi bắt đầu load trnag
    useEffect(() => {
        const getAllNameCategory = async () => {
            try {
                const res = await axios.get('http://localhost:5000/category');
                console.log("All category: ", res.data);
                setGetAllCategory(res.data[0]);
            } catch (error) {
                console.error('Error fetching category:', error);
                setVariantApi([]);
            }
        }
        const getAllVariant = async () => {
            try {
                const res = await axios.get('http://localhost:5000/variant/getAllVariant');
                console.log("all variant: ", res.data);
                setAllVariant(res.data);
            } catch (error) {
                console.error('Error fetching varaint:', error);
                setVariantApi([]);
            }
        }
        getAllNameCategory();
        getAllVariant();
    }, []);
    //lấy các variant tương ưng với category đã chọn 
    useEffect(() => {
        const fetchVariantApi = async () => {
            try {
                const categoyrselected = selectedFilter["namecategory"] || [];
                if (categoyrselected.length > 0) {
                    const name = categoyrselected[0];
                    const res = await axios.get('http://localhost:5000/variant', {
                        params: { name: name }
                    });
                    console.log("data varaint theo category: ", res.data);
                    setVariantApi(res.data);
                }
            } catch (error) {
                console.error('Error fetching variants:', error);
                setVariantApi([]);
            }
        }
        fetchVariantApi();
    }, [selectedFilter["namecategory"]]);

    const handleOnchange = (key: string, value: string) => {
        setSelectedFilter(prev => {
            // xử lý trường hợp chọn nhiều category 1 lần
            // chỉ cho phép chọn 1 category
            if (key === 'namecategory') {
                const currentCategoy = prev[key] || []
                // kiểm tra nếu bấm vào category vẫn đang đưuọc chọn thì hủy nó đi
                if (currentCategoy.includes(value)) {
                    // const {[key]: _, ...rest} = prev // bỏ đi category đã chọn
                    // return rest;
                    // khi thay đổi category thì mọi varaint sẽ bị reset lại
                    return {
                    };
                }
                return {
                    [key]: [value]
                };
            }
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
    // gọi api khi bộ lọc hoặc trang thay đổi
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
                console.log("product sau khi lọc (raw): ", data.data);
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
    }, [selectedFilter, page]);

    // log khi productUi thay đổi (setState là async)
    useEffect(() => {
        if (productUi) {
            console.log("sản phẩm sau khi map vào usestate (đã cập nhật): ", productUi);
        }
    }, [productUi]);
    console.log('selected filter: ', selectedFilter);

    // Lấy dữ liệu filter từ API

    return (
        <div className="w-full px-4 sm:px-16 py-10 grid grid-cols-4">
            <div className="col-span-1">
                <>
                    {/* Hiển thị Category filter */}
                    <AccordionItem title="Category">
                        {
                            getAllcategory?.values.map((item, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        checked={Array.isArray(selectedFilter.namecategory)
                                            ? selectedFilter.namecategory.includes(item)
                                            : false}
                                        onChange={() => handleOnchange("namecategory", item)}
                                        className="w-[15px] h-[15px]"
                                    />
                                    <p className="text-[20px]">{item}</p>
                                </div>
                            ))
                        }
                    </AccordionItem>

                    {/* Hiển thị Price filter - không phụ thuộc API */}
                    <div className="w-full pr-4 mb-4">
                        <p className="py-2 text-start">Khoảng giá</p>
                        <div className="flex gap-2 w-full">
                            <input
                                onChange={(e) => setRangePrice(prev => (
                                    {
                                        ...prev,
                                        min: e.target.value
                                    }
                                ))}
                                className=" px-2 w-full border-[1px] border-[#626262]"
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
                                className="px-2 w-full border-[1px] border-[#626262]"
                                type="text" name="maxPrice" placeholder="$ Đến" />
                        </div>
                        {priceError && <p className="text-red-500 py-[20px]">{priceError}</p>}
                        <button
                            onClick={() => handleApplyPrice("price")}
                            className="w-full hover:cursor-pointer px-2 bg-green-500 py-2 mt-2 rounded-[10px] text-white"
                            type="submit">Áp dụng</button>
                    </div>

                    {/* khi chưa chọn category hoặc khi mới load trang */}
                    {
                        !selectedFilter["namecategory"] ? // kiểm tra nếu như chưa chọn category
                            allVariant?.map((item, index) => (
                                item.key != "category" && // không render category vì đã có phía trên
                                <AccordionItem key={index} title={item.key}>
                                    {
                                        item.values.map((value, index) => (
                                            <div key={index} className="flex items-center gap-4">
                                                <input
                                                    type="checkbox"
                                                    checked={Array.isArray(selectedFilter[item.key])
                                                        ? selectedFilter[item.key].includes(value)
                                                        : false}
                                                    onChange={() => handleOnchange(item.key, value)}
                                                    className="w-[15px] h-[15px]"
                                                />
                                                <p className="text-[20px]">{value}</p>
                                            </div>
                                        ))
                                    }
                                </AccordionItem>)
                            ) : (
                                //  Bọc 2 element trong một Fragment
                                <>
                                    {/* Element 1: Brand */}
                                    <AccordionItem title="Brand">
                                        {
                                            variantApi.map((item, index) => (
                                                item.brand.map((brandItem, index) => (
                                                    <div key={index} className="flex items-center gap-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={Array.isArray(selectedFilter.brand)
                                                                ? selectedFilter.brand.includes(brandItem)
                                                                : false}
                                                            onChange={() => handleOnchange("brand", brandItem)}
                                                            className="w-[15px] h-[15px]"
                                                        />
                                                        <p className="text-[20px]">{brandItem}</p>
                                                    </div>
                                                ))
                                            ))
                                        }
                                    </AccordionItem>

                                    {/* Element 2: Variant */}
                                    {
                                        variantApi.map((item, index) => (
                                            item.variant && Object.keys(item.variant).map((variantKey, index) => (
                                                <AccordionItem key={index} title={variantKey}>
                                                    {item.variant[variantKey].map((value, valueIndex) => (
                                                        <div key={valueIndex} className="flex items-center gap-4">
                                                            <input
                                                                type="checkbox"
                                                                checked={Array.isArray(selectedFilter[variantKey])
                                                                    ? selectedFilter[variantKey].includes(value)
                                                                    : false}
                                                                onChange={() => handleOnchange(variantKey, value)}
                                                                className="w-[15px] h-[15px]"
                                                            />
                                                            <p className="text-[20px]">{value}</p>
                                                        </div>
                                                    ))}
                                                </AccordionItem>
                                            ))
                                        ))
                                    }
                                </>
                            )
                    }
                </>
            </div>
            <div className="col-span-3 gap-10 grid grid-cols-3">
                {
                    productUi?.items?.map((p, index) => (
                        <Product key={index} product={p} selectedFilter={selectedFilter}></Product>
                    ))
                }
            </div>
            <div>
                <ul className="flex gap-3">
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                </ul>
            </div>
        </div >
    )
}