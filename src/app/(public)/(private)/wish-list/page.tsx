"use client";
import BackNavigation from "@/components/ui/BackNavigation";
import NavigationPath from "@/components/ui/NavigationPath";
import { useWishlist } from "@/hooks/useWishlist";
import { formatCurrency } from "@/utils/currency";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function WishList() {
  const route = useRouter();
  const { items, loading, error, remove, refresh } = useWishlist();

  const handleDelete = async (productId: number) => {
    try {
      await remove(productId);
      toast.success("Deleted", { duration: 3000 });
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    }
  };

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
                {["PRODUCTS", "PRICE", "STOCK STATUS", "REMOVE"].map((h) => (
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
              <th className="py-3 px-4 font-['Public Sans'] text-[11.53px] whitespace-nowrap">REMOVE</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const raw = item.imageUrl ?? "";
              const cleaned = raw.trim().replace(/^\/+/, "");
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
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleDelete(item.productId)}
                      className="group relative flex items-center justify-center gap-2 rounded-[5px] font-['Public Sans'] text-[13.45px] font-semibold uppercase whitespace-nowrap h-[47px] w-[167px] overflow-hidden text-white bg-[#EE5858] transition-colors duration-300"
                      title="Remove from wishlist"
                    >
                      <span className="relative z-10">REMOVE</span>
                      <span className="absolute inset-0 bg-[#ff7b7b] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                    </button>
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
