export type ResponData = {
  data: any;
  message: string;
  status: number;
};
export interface ICategory {
  id: number;
  namecategory: string;
  idparent: number;
  product: number;
}

export type CategoryTree = {
  id: number;
  namecategory: string;
  product: number;
  children?: CategoryTree[];
};
export type IUser = {
  id: number;
  avatarImg?: string;
  name: string;
  tel: string;
  email: string;
  orders?: number;
  role: number;
};
export type IAddress = {
  accountid: number;
  codeward: number;
  createdate: string;
  description: string;
  detail: string;
  id: number;
  namerecipient: string;
  tel: string;
  title: string;
  updatedate: string;
};
export type IProductAdmin = {
  brand: string;
  category_id: number;
  category_name: string;
  createdate: string;
  description: string;
  imageurls: string[];
  max_price: number;
  min_price: number;
  name: string;
  product_id: number;
  updatedate: string;
  variant_count: number;
  variants: IVariant[];
};
export type IVariant = {
  createdate: string;
  inputprice: number;
  isdeleted: boolean;
  price: number;
  product_id: number;
  stock: number;
  sold?: number;
  updatedate: string;
  valuevariant: any;
  variant_id: number;
};
