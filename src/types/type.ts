// export type ResponData = {
//   data: any
//   message: string,
//   status: number
// }
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