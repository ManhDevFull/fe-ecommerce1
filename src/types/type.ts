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
  id: number,
  avatarImg?: string,
  name: string,
  tel: string,
  email: string,
  orders?: number
  role: number
}