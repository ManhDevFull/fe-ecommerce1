export type category = {
    _id: number;
    name_category: string;
}
export type variants = {
    key: string;
    values: string[];
}

export type VariantDTO = {
    id: number;
    valuevariant: string;
    stock: number;
    inputprice: number;
    price: number;
    createdate: Date;
    updatedate: Date;
}
export type Discount = {
    id: number;
    typediscount: number;
    discount: number;
    starttime: Date;
    endtime: Date;
    createtime: Date;
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
    discount: Discount;
    rating: number;
    order: number;
}
export type valueFilter = {
    [key: string]: string[];
}
export type page = {
    pageNumber: number;
    pageSize: number;
}
export type PagedResultDTO<T> = {
    Items: T[];
    PageNumber: number;
    PageSize: number;
    TotalCount: number;
    TotalPage: number;
}