import handleAPI from "./handleAPI";

export type WishlistItem = {
  id: number;
  productId: number;
  productName: string;
  imageUrl?: string;
  minPrice: number;
  totalStock: number;
};

export const getWishlist = async (): Promise<WishlistItem[]> => {
  return await handleAPI("/WishList");
};

export const addWishlist = async (productId: number): Promise<WishlistItem[]> => {
  return await handleAPI("/WishList", { productId }, "post");
};

export const removeWishlist = async (productId: number): Promise<WishlistItem[]> => {
  return await handleAPI(`/WishList/${productId}`, undefined, "delete");
};
