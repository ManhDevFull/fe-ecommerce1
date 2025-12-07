"use client";
import BackNavigation from "@/components/ui/BackNavigation";
import NavigationPath from "@/components/ui/NavigationPath";
import { useWishlist } from "@/hooks/useWishlist";
import { formatCurrency } from "@/utils/currency";
import handleAPI from "@/axios/handleAPI";
import { addToCart } from "@/axios/cart";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoCloseCircleOutline } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";
import { toast } from "sonner";

export default function WishList() {
  const route = useRouter();
  const { items, loading, error, remove, refresh } = useWishlist();

  const handleAddToCart = async (productId: number) => {
    try {
      // Lấy variant khả dụng từ detail sản phẩm
      const product: any = await handleAPI(`Product/detail-product/${productId}`);
      const variantId =
        product?.variant?.find((v: any) => v.stock > 0)?.id ??
        product?.variant?.[0]?.id;
      if (!variantId) {
        toast.error("Không tìm thấy biến thể để thêm vào giỏ");
        return;
      }
      await addToCart(variantId, 1);
      toast.success("Added to my cart", { duration: 3000 });
      // Nếu muốn tự động xóa khỏi wishlist sau khi add, gọi: await remove(productId);
    } catch (e: any) {
      toast.error(e?.message || "Add to cart failed");
    }
  };

  const handleDelete = async (productId: number) => {
    try {
      await remove(productId);
      toast.success("Deleted", { duration: 3000 });
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    }
  };

  if (loading) {
    return <div className="p-4">Loading wishlist...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error} <button onClick={refresh} className="underline">Retry</button>
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
        <div className="px-10 md:px-15 xl:px-40 py-6">Wishlist trống.</div>
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
              <th className="py-3 px-4 font-['Public Sans'] text-[11.53px] whitespace-nowrap">PRODUCTS</th>
              <th className="py-3 px-4 font-['Public Sans'] text-[11.53px] whitespace-nowrap">PRICE</th>
              <th className="py-3 px-4 font-['Public Sans'] text-[11.53px] whitespace-nowrap">STOCK STATUS</th>
              <th className="py-3 px-4 font-['Public Sans'] text-[11.53px] whitespace-nowrap">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const raw = item.imageUrl ?? "";
              const cleaned = raw.trim().replace(/^\/+/, ""); // bỏ slash đầu
              const safeSrc = !cleaned
                ? "/next.svg"
                : /^https?:\/\//i.test(cleaned)
                ? cleaned
                : `/${cleaned}`;

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
                    <div className="flex items-center justify-between">
                      <button
                        disabled={item.totalStock <= 0}
                        onClick={() => handleAddToCart(item.productId)}
                        className={`group relative flex items-center rounded-[5px] justify-center gap-2 font-['Public Sans'] text-[13.45px] font-semibold uppercase whitespace-nowrap h-[47px] w-[167px] overflow-hidden ${
                          item.totalStock > 0
                            ? "bg-[#1877F2] hover:text-[#FFFFFF] transition-colors duration-300 cursor-pointer"
                            : "bg-[#ADB7BC] cursor-not-allowed"
                        } text-[#FFFFFF]`}
                      >
                        <span className="relative z-10">ADD TO CART</span>
                        <MdOutlineShoppingCart size={19.21} color="#FFFFFF" className="relative z-10" />
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
    </main>
  );
}
