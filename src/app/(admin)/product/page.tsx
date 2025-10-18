"use client";
import handleAPI from "@/axios/handleAPI";
import ChooseModule from "@/components/modules/ChooseModal";
import FilterBar, {
  FilterParams,
} from "@/components/templates/Admin/filterProduct";
import ProductAction from "@/components/templates/Admin/ProductAction";
import renderVariant from "@/components/templates/Admin/tableVariant";
import ActionMenu from "@/components/ui/AvtionMenu";
import Collapse from "@/components/ui/collapse";
import Pagination from "@/components/ui/pageNavigation";
import PlusMinusIcon from "@/components/ui/PlusMinusIcon";
import Expando from "@/components/ui/ResizeObserver";
import { IProductAdmin, IVariant } from "@/types/type";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ProductPage() {
  const pathname = usePathname();
  const [openIds, setOpenIds] = useState<number[]>([]);
  const [isPage, setIsPage] = useState(1);
  const [totalItem, setTotalItem] = useState(1);
  const [products, setProducts] = useState<IProductAdmin[]>([]);
    const [isModalCreate, setIsModalCreate] = useState(false);
  const [isModalDel, setIsModalDel] = useState(false);
    const [selectedPrd, setSelectedPrd] = useState<IProductAdmin | null>(null);
  const [filter, setFilter] = useState<{
    name: string;
    sort: string | "newest" | "priceAsc" | "priceDesc";
    brand: string;
    cate?: number;
    isStock: boolean;
  }>({
    name: "",
    sort: "",
    brand: "",
    cate: undefined,
    isStock: false,
  });
  useEffect(() => {
    const getProduct = async () => {
      const params = new URLSearchParams();
      params.set("page", String(isPage));
      params.set("size", "20");

      if (filter.name) params.set("name", filter.name);
      if (filter.brand) params.set("brand", filter.brand);
      if (filter.cate !== undefined) params.set("cate", String(filter.cate));
      if (filter.sort) params.set("sort", filter.sort);
      if (filter.isStock) params.set("stock", "true");

      const api = `admin/Product?${params.toString()}`;

      try {
        const res = await handleAPI(api);
        console.log(res);
        if (res.status === 200) {
          setProducts(res.data.items);
          setTotalItem(res.data.total);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getProduct();
  }, [isPage, filter]);
  const deleteProduct =async ()=>{
    const api = `/admin/Product`
    try {
      const res = await handleAPI(api, {id: selectedPrd?.product_id}, "delete")
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }
  const handleFilterChange = useCallback((f: FilterParams) => {
    setFilter({
      name: f.q,
      brand: f.brand,
      cate: f.categoryId ? Number(f.categoryId) : undefined,
      isStock: f.inStockOnly,
      sort: f.sort,
    });
    setIsPage(1); // reset page khi đổi filter
  }, []);
  const getBgForLevel = (level: number) => {
    const lightness = Math.max(98 - level * 6, 86);
    return `hsl(0 0% ${lightness}%)`;
  };
  const toggleOpen = (id: number) =>
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  const handleView = (prd: IProductAdmin, type: string) => {
    setSelectedPrd(prd);
    if (type === "create") setIsModalCreate(true);
    if (type === "del") setIsModalDel(true);
  };
  return (
    <div className="rounded-lg bg-[#D9D9D940] p-2 shadow-[0px_2px_4px_rgba(0,0,0,0.25)] w-full h-full">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-[26px] mb-2">Products</h1>
        <FilterBar
          categories={[
            { id: "1", name: "Điện thoại" },
            { id: "2", name: "Laptop" },
          ]}
          brands={["Apple", "Samsung", "Xiaomi"]}
          defaultValues={{
            q: "",
            categoryId: "",
            brand: "",
            inStockOnly: false,
            sort: "newest",
          }}
          onChange={handleFilterChange}
        />
      </div>
      <div className="grid grid-cols-24 border-t border-gray-200 shadow rounded-b-md overflow-hidden">
        {/* header */}
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-1 text-center">
          #
        </div>
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-7 pl-1">
          Product name
        </div>
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-2 text-center">
          Brand
        </div>
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-3 text-center">
          Category
        </div>
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-2 text-center">
          Stock
        </div>
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-7">
          Images
        </div>
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-2 text-center">
          Action
        </div>
        {/* body */}
        <div
          className="col-span-24 flex-grow overflow-y-auto bg-[#ffffff80]  scrollbar-hidden"
          style={{ maxHeight: "calc(100vh - 260px)" }}
        >
          {products.length === 0 ? (
            <div className="w-full text-center text-[#474747] py-3 bg-[#ffffff70]">
              There are no categories.
            </div>
          ) : (
            products.map((prd, i) => {
              const level = 0;
              const indexStr = String(i + 1);
              const isOpen = openIds.includes(prd.product_id);
              const total =
                prd.variants?.reduce((acc, v) => acc + (v.stock ?? 0), 0) ?? 0;

              return (
                <div key={`product-${prd.product_id}`} className="w-full">
                  <div
                    className="text-[#474747] grid grid-cols-24 py-3 border-t border-[#00000008] items-center"
                    style={{ backgroundColor: getBgForLevel(level) }}
                  >
                    <div className="text-[#474747] py-2 col-span-1 flex justify-center items-center">
                      {indexStr}
                    </div>

                    <div
                      className="text-[#474747] py-2 col-span-7 pl-1 flex items-center cursor-pointer select-none"
                      onClick={() => {
                        if (prd.variants && prd.variants.length > 0) {
                          toggleOpen(prd.product_id);
                        }
                      }}
                    >
                      {prd.variants && prd.variants.length > 0 && (
                        <PlusMinusIcon isOpen={isOpen} />
                      )}
                      {prd.name}
                    </div>

                    <div className="text-[#474747] py-2 col-span-2 flex justify-center items-center">
                      {prd.brand}
                    </div>
                    <div className="text-[#474747] py-2 col-span-3 flex justify-center items-center">
                      {prd.category_name}
                    </div>
                    <div className="text-[#474747] py-2 col-span-2 flex justify-center items-center">
                      {total}
                    </div>
                    <div className="text-[#474747] py-2 col-span-7 flex items-center overflow-hidden overflow-x-auto scrollbar-hidden">
                      ImagesIm
                    </div>
                    <div className="text-[#474747] py-2 col-span-2 flex items-center justify-center">
                      <ProductAction
                        onCreate={() => handleView(prd, "create")}
                        onDelete={() => handleView(prd, "del")}
                      />
                    </div>
                  </div>

                  {prd.variants && prd.variants.length > 0 && (
                    <Expando open={isOpen} duration={260}>
                      <div
                        id={`variants-${prd.product_id}`}
                        className="bg-[#fafafa] border-t border-gray-200 pl-2"
                      >
                        <div
                          className="text-[#474747] grid grid-cols-22 border-t border-[#00000008] items-center"
                          style={{ backgroundColor: getBgForLevel(1) }}
                        >
                          <div className="text-[#474747] py-2 col-span-1 flex justify-center items-center">
                            #
                          </div>
                          <div className="text-[#474747] py-2 col-span-9 pl-1 flex items-center">
                            Variant Details
                          </div>
                          <div className="text-[#474747] py-2 col-span-2 flex justify-center items-center">
                            Price
                          </div>
                          <div className="text-[#474747] py-2 col-span-3 flex justify-center items-center">
                            Input Price
                          </div>
                          <div className="text-[#474747] py-2 col-span-2 flex justify-center items-center">
                            Stock
                          </div>
                          <div className="text-[#474747] py-2 col-span-2 flex justify-center items-center">
                            Sold
                          </div>
                          <div className="text-[#474747] py-2 col-span-3 flex items-center">
                            Action
                          </div>
                        </div>
                        {prd.variants.map((variant, j) => (
                          <span key={variant.variant_id} className="block">
                            {renderVariant(variant, j + 1, level + 1, indexStr)}
                          </span>
                        ))}
                      </div>
                    </Expando>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="w-full h-10 flex justify-center items-center">
        <Pagination
          totalPage={Math.max(1, Math.ceil(totalItem / 30))}
          page={isPage}
          totalProduct={totalItem}
          onChangePage={(val) => setIsPage(val)}
        />
      </div>
        <ChooseModule
              text="Are you sure you want to delete this product?"
              styleYes="bg-[#ff000095] text-white"
              open={isModalDel}
              onClose={() => setIsModalDel(false)}
              onYes={() => {
                console.log("yes");
                setIsModalDel(false)
              }}
            />
    </div>
  );
}
