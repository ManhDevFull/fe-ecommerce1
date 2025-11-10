"use client"
import AccordionItem from "@/components/ui/AccordionItem";
import Product from "@/components/ui/Product";
import loading from "@/components/ui/loading";
import axios from "axios";
import { min, previousDay } from "date-fns";
import { da } from "date-fns/locale";
import { number } from "framer-motion";
import { div, header, input, object, p, param, pre } from "framer-motion/client";
import React, { Children, useEffect, useState } from "react"
import { FiMinus } from "react-icons/fi";
import { json } from "stream/consumers";
import { PaginationInfo, category, variants, VariantDTO, ProductUi, valueFilter, PagedResultDTO, allvariant } from "../../../types/type";
import { types } from "util";
import { title } from "process";
import { VscLaw } from "react-icons/vsc";
import { UserSearch } from "iconsax-react";
import Loading from "@/components/ui/loading";
import { LoadingProduct } from "@/components/ui/LoadingProduct";
import { Pagination } from "antd";
import Page from "@/app/(maketing)/page";
import { PageFilter } from "@/components/ui/Pagination";
import { useSearchParams } from "next/navigation";
export default function Filter(props: {
    onSetTotal: (total: number) => void;
    type: boolean;
}) {
    const { type } = props;// lấy cách hiển thị từ bên showwItem
    const { onSetTotal } = props // call back từ page. để lấy tổng sản phẩm sau khi select
    const [page, setPage] = useState<PaginationInfo>({
        pageNumber: 1,
        pageSize: 9
    });
    // lưu variant khi category thay đổi
    const [variantApi, setVariantApi] = useState<variants[]>([]);
    // lấy param khi tìm kiếm
    const searchParam = useSearchParams();
    const query = searchParam.get('query') || '';

    const [priceError, setPriceError] = useState('')// lỗi khi nhập giá

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

    // icon loading khi bắt đầu vào trang
    const [isLoading, setIsLoading] = useState(true);
    // icon loading sau khi lọc sản phẩm
    const [isLoadingProduct, setIsLoadingProduct] = useState(true);
    // useState cho variant khi bắt đầu load trang
    const [allVariant, setAllVariant] = useState<allvariant[] | null>(null);
    // useState cho tên của tất cả các category, luôn cố định khi load trang
    const [getAllcategory, setGetAllCategory] = useState<allcategory>();
    // lấy tên ra category khi bắt đầu load trang(không thay đổi)
    // lấy ra tất cả variant khi bắt đầu load trnag

    useEffect(() => {
        const fetchData = async () => {
            // 1. Đảm bảo loading đang BẬT khi bắt đầu fetch
            setIsLoading(true);

            try {
                // 2. Gọi song song 2 API
                const [categoryRes, variantRes] = await Promise.all([
                    axios.get('http://localhost:5000/category'),
                    axios.get('http://localhost:5000/variant/getAllVariant')
                ]);

                // 3. Cả hai API đã thành công, set state
                console.log("All category: ", categoryRes.data);
                setGetAllCategory(categoryRes.data[0]);

                console.log("all variant: ", variantRes.data);
                setAllVariant(variantRes.data);

            } catch (error) {
                console.error('Error fetching data:', error);
                // Xử lý lỗi nếu 1 trong 2 API thất bại
                setVariantApi([]);
                // setGetAllCategory(null); // Hoặc giá trị mặc định
            } finally {
                // 4. Luôn TẮT loading sau khi try (thành công) hoặc catch (thất bại)
                setIsLoading(false);
            }
        }

        fetchData();
    }, []); // Chỉ chạy 1 lần khi component mount

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
                // reset rangePrice về chuỗi rỗng ban đầu
                setRangePrice({
                    min: '',
                    max: ''
                });
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
    // còn lỗi chưa đổi lại danh mục
    useEffect(() => {
        const handleSend = async () => {
            try {
                setIsLoadingProduct(true);
                //if (Object.keys(selectedFilter).length === 0)
                //return;
                const data = await axios.post('http://localhost:5000/product/filter',
                    {
                        filter: selectedFilter,
                        pageNumber: page.pageNumber,
                        pageSize: page.pageSize,
                        query: query
                    });
                setProductUi(data.data);
                onSetTotal(data.data.totalCount ?? 0);
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
            finally {
                setIsLoadingProduct(false);
            }
        }
        handleSend();
    }, [selectedFilter, page, query]);

    console.log('selected filter: ', selectedFilter);
    // xử lý thay đổi page thì Pagination(componet con) có sự thấy đổi
    const handOnchangPage = (page: number, size: number) => {
        setPage({
            pageNumber: page,
            pageSize: size
        });
    }
    return (
        !isLoading ? (
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
                                    value={rangePrice.min}
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
                                    value={rangePrice.max}
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
                                    item.key == "brand" && // không render category vì đã có phía trên
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
                                ) :
                                 (
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
                                        {/* sau khi chọn category thi variant lọc theo tương ứng */}
                                        {
                                            selectedFilter["namecategory"]?.length > 0 && (
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
                                            )
                                        }
                                    </>
                                )
                        }
                    </>
                </div>
                {isLoadingProduct ? (
                    <div className="w-full col-span-3 flex justify-center">
                        <LoadingProduct />
                    </div>
                ) : (
                    <div className={`col-span-3 gap-10 ${type ? 'grid grid-cols-3 auto-rows-fr' :''}`}>
                        {
                            productUi!.totalCount > 0 ?
                                productUi?.items?.map((p, index) => (
                                    <Product key={index} product={p} selectedFilter={selectedFilter} type={type}></Product>
                                )) :
                                <p className="text-red-700">Chưa có sản phẩm nào</p>
                        }
                        {/* phân trang */}
                        {productUi!.totalCount > 0 && (
                            <div className="col-span-3 flex justify-center">
                                <PageFilter pageprops={page} onChangePage={handOnchangPage} totablPgae={productUi?.totalPage || 1} />
                            </div>)}
                    </div>
                )}
            </div >) : (
            <Loading />
        )
    )
}