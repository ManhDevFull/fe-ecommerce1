import handleAPI from "@/axios/handleAPI";

export const getCart = async () => handleAPI("/Cart");

export const addToCart = async (variantId: number, quantity: number) =>
  handleAPI("/Cart/add", { variantId, quantity }, "post");

export const updateQuantity = async (cartId: number, quantity: number) =>
  handleAPI("/Cart/quantity", { cartId, quantity }, "patch");

export const removeCartItem = async (cartId: number) =>
  handleAPI(`/Cart/${cartId}`, undefined, "delete");
