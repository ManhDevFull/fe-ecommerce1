"use client";
import BackNavigation from "@/components/ui/BackNavigation";
import NavigationPath from "@/components/ui/NavigationPath";
import { useWishlist } from "@/hooks/useWishlist";
import { formatCurrency } from "@/utils/currency";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import handleAPI from "@/axios/handleAPI";
import { addToCart } from "@/axios/cart";
import VariantSelector from "@/components/templates/Detail/VariantSelector";
import Quantity from "@/components/ui/Quantity";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { ProductUi, VariantDTO } from "@/types/type";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";

export default function WishList() {
  const route = useRouter();
  const { items, loading, error, remove, refresh } = useWishlist();
  const [variantOpen, setVariantOpen] = useState(false);
  const [variantProduct, setVariantProduct] = useState<ProductUi | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<VariantDTO | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loadingVariant, setLoadingVariant] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const getSafeSrc = (raw?: string) => {
    const cleaned = (raw ?? "").trim().replace(/^\/+/, "");
    if (!cleaned) return "/next.svg";
    return /^https?:\/\//i.test(cleaned) ? cleaned : `/${cleaned}`;
  };

  const handleDelete = async (productId: number) => {
    try {
      await remove(productId);
      toast.success("Deleted", { duration: 3000 });
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    }
  };

  const closeVariantModal = () => {
    setVariantOpen(false);
    setVariantProduct(null);
    setSelectedVariant(null);
    setQuantity(1);
    setLoadingVariant(false);
    setAddingToCart(false);
  };

  const handleOpenVariant = async (productId: number) => {
    setVariantOpen(true);
    setLoadingVariant(true);
    setVariantProduct(null);
    setSelectedVariant(null);
    setQuantity(1);
    try {
      const res = (await handleAPI(
        `Product/detail-product/${productId}`
      )) as unknown as ProductUi;
      setVariantProduct(res);
      if (res?.variant?.length) {
        setSelectedVariant(res.variant[0]);
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to load product variants");
      setVariantOpen(false);
    } finally {
      setLoadingVariant(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }
    setAddingToCart(true);
    try {
      await addToCart(selectedVariant.id, quantity);
      toast.success("Added to cart");
      closeVariantModal();
    } catch (e: any) {
      toast.error(e?.message || "Add to cart failed");
    } finally {
      setAddingToCart(false);
    }
  };
  const modalImage = getSafeSrc(variantProduct?.imgUrls?.[0]);

  if (loading) {
    return (
      <main className="pt-2">
        <NavigationPath />
        <BackNavigation />
        <div className="px-10 md:px-15 xl:px-40 space-y-4">
          <div className="h-7 w-32 bg-gray-200 animate-pulse rounded" />
          <div className="overflow-x-auto">
            <div className="min-w-full rounded-lg border border-gray-200">
              <div className="bg-gray-100 border-b border-gray-200 grid grid-cols-4">
                {["PRODUCTS", "PRICE", "STOCK STATUS", "ACTIONS"].map((h) => (
                  <div key={h} className="py-3 px-4 text-xs font-semibold text-gray-600">
                    {h}
                  </div>
                ))}
              </div>
              <div className="divide-y">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="grid grid-cols-4 items-center py-4 px-4 gap-4 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded" />
                      <div className="space-y-2">
                        <div className="h-4 w-40 bg-gray-200 rounded" />
                        <div className="h-3 w-32 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-10 w-32 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error}{" "}
        <button onClick={refresh} className="underline">
          Retry
        </button>
      </div>
    );
  }

  if (!items.length) {
    return (
      <main className="pt-2">
        <NavigationPath />
        <BackNavigation />
        <h1 className="font-bold text-xl sm:text-2xl py-2 px-10 md:px-15 xl:px-40">
          WishList
        </h1>
        <div className="px-10 md:px-15 xl:px-40 py-6">Wishlist is empty.</div>
      </main>
    );
  }

  return (
    <main className="pt-2">
      <NavigationPath />
      <BackNavigation />
      <h1 className="font-bold text-xl sm:text-2xl py-2 px-10 md:px-15 xl:px-40">
        WishList
      </h1>
      <div className="overflow-x-auto mx-10 md:mx-15 xl:mx-40">
        <table className="min-w-full rounded-lg border border-gray-200">
          <thead className="bg-gray-100 text-left text-gray-700 border border-gray-200">
            <tr>
              <th className="py-3 px-4 font-['Public Sans'] text-[11.53px] whitespace-nowrap">
                PRODUCTS
              </th>
              <th className="py-3 px-4 font-['Public Sans'] text-[11.53px] whitespace-nowrap">
                PRICE
              </th>
              <th className="py-3 px-4 font-['Public Sans'] text-[11.53px] whitespace-nowrap">
                STOCK STATUS
              </th>
              <th className="py-3 px-4 font-['Public Sans'] text-[11.53px] whitespace-nowrap">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const safeSrc = getSafeSrc(item.imageUrl);

              return (
                <tr key={item.productId} className="hover:bg-gray-50">
                  <td
                    className="py-4 px-4 flex items-center gap-4 cursor-pointer"
                    onClick={() => route.push(`/detail-product/${item.productId}`)}
                  >
                    <Image
                      src={safeSrc}
                      alt={item.productName}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-contain"
                    />
                    <span className="font-['Public Sans'] text-[13.45px] font-medium text-gray-800 break-words whitespace-normal">
                      {item.productName}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-700 font-['Public Sans'] text-[13.45px]">
                    {formatCurrency(item.minPrice, { decimals: 0 })}
                  </td>
                  <td
                    className={`py-4 px-4 font-['Public Sans'] text-[13.45px] font-semibold uppercase whitespace-nowrap ${
                      item.totalStock > 0 ? "text-[#2DB224]" : "text-[#EE5858]"
                    }`}
                  >
                    {item.totalStock > 0 ? "In Stock" : "Out of Stock"}
                  </td>
                  <td className="py-4 px-4 h-[47px] w-[240px]">
                    <div className="flex items-center justify-between gap-3">
                      <button
                        disabled={item.totalStock <= 0}
                        onClick={() => handleOpenVariant(item.productId)}
                        className={`group relative flex items-center rounded-[5px] justify-center gap-2 font-['Public Sans'] text-[13.45px] font-semibold uppercase whitespace-nowrap h-[47px] w-[167px] overflow-hidden ${
                          item.totalStock > 0
                            ? "bg-[#1877F2] hover:text-[#FFFFFF] transition-colors duration-300 cursor-pointer"
                            : "bg-[#ADB7BC] cursor-not-allowed"
                        } text-[#FFFFFF]`}
                      >
                        <span className="relative z-10">ADD TO CART</span>
                        <MdOutlineShoppingCart
                          size={19.21}
                          color="#FFFFFF"
                          className="relative z-10"
                        />
                        {item.totalStock > 0 && (
                          <span className="absolute inset-0 bg-[#29c9d7] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                        )}
                      </button>
                      <IoCloseCircleOutline
                        size={23.05}
                        className="text-[#929FA5] hover:text-[#EE5858] transition-colors duration-300 cursor-pointer"
                        onClick={() => handleDelete(item.productId)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        open={variantOpen}
        onClose={closeVariantModal}
        variant="centered"
        size="lg"
        showOverlay
        showCloseButton
        className="bg-white"
      >
        <ModalHeader>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-[#2b2b2b]">
              Add to cart
            </h3>
            <span className="text-xs text-gray-500">
              {variantProduct?.name ?? "Choose variant"}
            </span>
          </div>
        </ModalHeader>
        <ModalBody className="gap-4" scrollable>
          {loadingVariant ? (
            <div className="flex h-40 items-center justify-center text-sm text-gray-500">
              Loading variants...
            </div>
          ) : !variantProduct ? (
            <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
              Product details are not available.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Image
                  src={modalImage}
                  alt={variantProduct.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded object-contain border border-gray-200"
                />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {variantProduct.name}
                  </p>
                  {selectedVariant && (
                    <p className="text-sm text-gray-600">
                      {formatCurrency(selectedVariant.price, { decimals: 2 })}
                    </p>
                  )}
                  {selectedVariant && (
                    <p
                      className={`text-xs font-semibold ${
                        selectedVariant.stock > 0
                          ? "text-[#2DB224]"
                          : "text-[#EE5858]"
                      }`}
                    >
                      {selectedVariant.stock > 0 ? "In Stock" : "Out of Stock"}
                    </p>
                  )}
                </div>
              </div>

              {variantProduct.variant.length > 0 ? (
                <VariantSelector
                  variants={variantProduct.variant}
                  onVariantChange={(next) => setSelectedVariant(next)}
                />
              ) : (
                <div className="text-sm text-gray-500">
                  No variants available for this product.
                </div>
              )}

              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  Quantity
                </p>
                <Quantity onchange={(value: number) => setQuantity(value)} />
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter className="justify-end gap-3">
          <button
            onClick={closeVariantModal}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAddToCart}
            disabled={
              addingToCart ||
              loadingVariant ||
              !selectedVariant ||
              selectedVariant.stock <= 0
            }
            className="px-4 py-2 rounded-md bg-[#1877F2] text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {addingToCart ? "Adding..." : "Add to cart"}
          </button>
        </ModalFooter>
      </Modal>
    </main>
  );
}
