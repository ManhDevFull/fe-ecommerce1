export type category = {
    _id: number;
    name_category: string;
}

export type VariantDTO = {
    id: number;
    valuevariant:  { [key: string]: string };
    stock: number;
    inputprice: number;
    discounts: DiscountDTO[]
    price: number;
}
export type DiscountDTO = {
    id: number;
    typediscount: number;
    discount: number;
    starttime: Date;
    endtime: Date;
}
export type ProductUi = {
    id: number;
    name: string;
    description: string;
    brand: string;
    categoryId: number;
    categoryName: string;
    imgUrls: string[];
    variant: VariantDTO[];
    rating: number;
    order: number;
}
// lấy ra tất cả variant khi bắt đầu load trang
export type allvariant = {
    key: string;
    values: string[];
}
// lưu khi cetgory thay đổi, lấy brand, variant theo category
export type variants = {
    id: number;
    namecategory: string;
    brand: string[];
    variant: valueFilter;
}

export type valueFilter = {
    [key: string]: string[];
}
export type PaginationInfo  = {
    pageNumber: number;
    pageSize: number;
}
export type PagedResultDTO<T> = {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPage: number;
}
// time unit
export type timeUnit = {
    endtime: Date;
    unit: {
        day?: string,
        hour: string,
        min: string,
        sec: string
    }
}
// img product
export type imgproductProps = {
    img: string;
    type: boolean;
    isNew: boolean;
}