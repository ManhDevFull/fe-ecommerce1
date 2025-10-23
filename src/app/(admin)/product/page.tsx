"use client";

import { formatTree } from "@/app/utils/formartTree";
import handleAPI from "@/axios/handleAPI";
import ChooseModule from "@/components/modules/ChooseModal";
import ProductUpsertModal, {
  ProductFormSubmit,
} from "@/components/modules/product/ProductUpsertModal";
import VariantUpsertModal, {
  VariantFormSubmit,
} from "@/components/modules/product/VariantUpsertModal";
import FilterBar, {
  FilterParams,
  BrandItem,
} from "@/components/templates/Admin/filterProduct";
import Image from "next/image";
import ProductAction from "@/components/templates/Admin/ProductAction";
import renderVariant from "@/components/templates/Admin/tableVariant";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui/pageNavigation";
import PlusMinusIcon from "@/components/ui/PlusMinusIcon";
import Expando from "@/components/ui/ResizeObserver";
import { CategoryTree, IProductAdmin, IVariant } from "@/types/type";
import { useCallback, useEffect, useState } from "react";

type FilterState = {
  name: string;
  sort: string | "newest" | "priceAsc" | "priceDesc";
  brand: string;
  cate?: number;
  isStock: boolean;
};

const DEFAULT_FILTER: FilterState = {
  name: "",
  sort: "",
  brand: "",
  cate: undefined,
  isStock: false,
};

export default function ProductPage() {

  const [openIds, setOpenIds] = useState<number[]>([]);
  const [isPage, setIsPage] = useState(1);
  const [totalItem, setTotalItem] = useState(0);
  const [products, setProducts] = useState<IProductAdmin[]>([]);
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [listCate, setListCate] = useState<CategoryTree[]>([]);
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [reloadFlag, setReloadFlag] = useState(0);

  // Product modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState<"create" | "edit">(
    "create"
  );
  const [productModalSubmitting, setProductModalSubmitting] = useState(false);
  const [productModalError, setProductModalError] = useState("");
  const [editingProduct, setEditingProduct] = useState<IProductAdmin | null>(
    null
  );

  // Variant modal state
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [variantModalMode, setVariantModalMode] = useState<"create" | "edit">(
    "create"
  );
  const [variantModalSubmitting, setVariantModalSubmitting] = useState(false);
  const [variantModalError, setVariantModalError] = useState("");
  const [variantContext, setVariantContext] = useState<{
    product: IProductAdmin;
    variant?: IVariant;
  } | null>(null);

  // Delete confirmations
  const [productToDelete, setProductToDelete] = useState<IProductAdmin | null>(
    null
  );
  const [variantToDelete, setVariantToDelete] = useState<{
    product: IProductAdmin;
    variant: IVariant;
  } | null>(null);

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await handleAPI("/admin/category");
        if (res.status === 200) {
          setListCate(formatTree(res.data));
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch product list on filter/page changes
  useEffect(() => {
    const fetchProducts = async () => {
      const params = new URLSearchParams();
      params.set("page", String(isPage));
      params.set("size", "20");

      if (filter.name) params.set("name", filter.name);
      if (filter.brand) params.set("brand", filter.brand);
      if (filter.cate !== undefined) params.set("cate", String(filter.cate));
      if (filter.sort) params.set("sort", filter.sort);
      if (filter.isStock) params.set("stock", "true");

      try {
        const res = await handleAPI(`admin/Product?${params.toString()}`);
        if (res.status === 200) {
          setProducts(res.data.items ?? []);
          setTotalItem(res.data.total ?? 0);
        }
      } catch (error) {
        console.error("Failed to load products", error);
      }
    };

    fetchProducts();
  }, [isPage, filter, reloadFlag]);

  // Fetch brands whenever category filter changes
  useEffect(() => {
    let cancelled = false;
    const fetchBrands = async () => {
      const query = filter.cate !== undefined ? `?cate=${filter.cate}` : "";
      try {
        const res = await handleAPI(`/admin/category/brand${query}`);
        if (cancelled) return;
        if (res?.status === 200) {
          const items = Array.isArray(res.data) ? res.data : [];
          setBrands(items);
          // Reset brand filter if current brand no longer valid
          if (filter.brand && !items.some((b) => b.name === filter.brand)) {
            setFilter((prev) => ({ ...prev, brand: "" }));
          }
        } else {
          setBrands([]);
        }
      } catch (error) {
        if (!cancelled) {
          setBrands([]);
        }
        console.error("Failed to load brands", error);
      }
    };
    fetchBrands();
    return () => {
      cancelled = true;
    };
  }, [filter.cate]);

  const refreshProducts = () => setReloadFlag((flag) => flag + 1);

  const handleFilterChange = useCallback(
    (f: FilterParams) => {
      const brandName =
        f.brandId && f.brandId !== ""
          ? brands.find((b) => String(b.id) === f.brandId)?.name ?? ""
          : "";
      setFilter({
        name: f.q,
        brand: brandName,
        cate: f.categoryId ? Number(f.categoryId) : undefined,
        isStock: f.inStockOnly,
        sort: f.sort,
      });
      setIsPage(1);
    },
    [brands]
  );

  const getBgForLevel = (level: number) => {
    const lightness = Math.max(98 - level * 6, 86);
    return `hsl(0 0% ${lightness}%)`;
  };

  const toggleOpen = (id: number) =>
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const ensureRowExpanded = (productId: number) => {
    setOpenIds((prev) =>
      prev.includes(productId) ? prev : [...prev, productId]
    );
  };

  const openCreateProductModal = () => {
    setProductModalMode("create");
    setEditingProduct(null);
    setProductModalError("");
    setProductModalOpen(true);
  };

  const openEditProductModal = (product: IProductAdmin) => {
    setProductModalMode("edit");
    setEditingProduct(product);
    setProductModalError("");
    setProductModalOpen(true);
  };

  const handleProductSubmit = async (payload: ProductFormSubmit) => {
    setProductModalSubmitting(true);
    setProductModalError("");
    try {
      let endpoint = "/admin/Product";
      let method: "post" | "put" = "post";

      if (productModalMode === "edit" && editingProduct) {
        endpoint = `/admin/Product/${editingProduct.product_id}`;
        method = "put";
      }

      const res = await handleAPI(endpoint, payload, method);
      if (res.status === 200 || res.status === 201) {
        setProductModalOpen(false);
        setEditingProduct(null);
        if (productModalMode === "create") {
          setIsPage(1);
        }
        refreshProducts();
      } else {
        setProductModalError(res?.message ?? "Operation failed");
      }
    } catch (error: any) {
      const message =
        error?.message ??
        error?.data?.message ??
        error?.response?.data?.message ??
        "Operation failed";
      setProductModalError(message);
    } finally {
      setProductModalSubmitting(false);
    }
  };

  const openCreateVariantModal = (product: IProductAdmin) => {
    ensureRowExpanded(product.product_id);
    setVariantModalMode("create");
    setVariantContext({ product });
    setVariantModalError("");
    setVariantModalOpen(true);
  };

  const openEditVariantModal = (product: IProductAdmin, variant: IVariant) => {
    ensureRowExpanded(product.product_id);
    setVariantModalMode("edit");
    setVariantContext({ product, variant });
    setVariantModalError("");
    setVariantModalOpen(true);
  };

  const handleVariantSubmit = async (payload: VariantFormSubmit) => {
    if (!variantContext) return;
    setVariantModalSubmitting(true);
    setVariantModalError("");
    try {
      const { product, variant } = variantContext;
      let endpoint = `/admin/Product/${product.product_id}/variant`;
      let method: "post" | "put" = "post";

      if (variantModalMode === "edit" && variant) {
        endpoint = `/admin/Product/${product.product_id}/variant/${variant.variant_id}`;
        method = "put";
      }

      const res = await handleAPI(endpoint, payload, method);
      if (res.status === 200) {
        setVariantModalOpen(false);
        setVariantContext(null);
        refreshProducts();
      } else {
        setVariantModalError(res?.message ?? "Operation failed");
      }
    } catch (error: any) {
      const message =
        error?.message ??
        error?.data?.message ??
        error?.response?.data?.message ??
        "Operation failed";
      setVariantModalError(message);
    } finally {
      setVariantModalSubmitting(false);
    }
  };

  const handleConfirmDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      const res = await handleAPI(
        `/admin/Product/${productToDelete.product_id}`,
        null,
        "delete"
      );
      if (res.status === 200) {
        setProductToDelete(null);
        refreshProducts();
      }
    } catch (error) {
      console.error("Failed to delete product", error);
      setProductToDelete(null);
    }
  };

  const handleConfirmDeleteVariant = async () => {
    if (!variantToDelete) return;
    try {
      const res = await handleAPI(
        `/admin/Product/${variantToDelete.product.product_id}/variant/${variantToDelete.variant.variant_id}`,
        null,
        "delete"
      );
      if (res.status === 200) {
        setVariantToDelete(null);
        refreshProducts();
      }
    } catch (error) {
      console.error("Failed to delete variant", error);
      setVariantToDelete(null);
    }
  };

  const renderImages = (urls: string[] | undefined) => {
    if (!urls || urls.length === 0) {
      return <span className="text-xs text-gray-500 md:text-sm">No images</span>;
    }
    return (
    <div className="flex flex-wrap gap-1">
      {urls.map((url, idx) => (
        <div
          key={`${url}-${idx}`}
          className="rounded-md border border-gray-200 bg-white shadow-sm"
          title={url}
        >
          <img
            src={url}
            alt={`Image ${idx + 1}`}
            width={30}
            height={30}
            className="rounded-md object-cover"
          />
        </div>
      ))}
    </div>
    );
  };

  return (
    <div className="flex h-full w-full flex-col rounded-lg bg-[#D9D9D940] p-2 shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
      <div className="mb-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-[26px] font-medium text-[#2f2f2f]">Products</h1>
        <FilterBar
          categories={listCate}
          brands={brands}
          defaultValues={{
            q: DEFAULT_FILTER.name,
            categoryId: DEFAULT_FILTER.cate ? String(DEFAULT_FILTER.cate) : "",
            brandId: "",
            inStockOnly: DEFAULT_FILTER.isStock,
            sort: "newest",
          }}
          onChange={handleFilterChange}
        />
      </div>

      <div className="grid grid-cols-24 overflow-hidden rounded-b-md border-t border-gray-200 shadow">
        <div className="col-span-1 bg-[#00000007] py-2 text-center text-[#474747]">#</div>
        <div className="col-span-7 bg-[#00000007] py-2 pl-1 text-[#474747]">Product name</div>
        <div className="col-span-2 bg-[#00000007] py-2 text-center text-[#474747]">Brand</div>
        <div className="col-span-3 bg-[#00000007] py-2 text-center text-[#474747]">Category</div>
        <div className="col-span-2 bg-[#00000007] py-2 text-center text-[#474747]">Stock</div>
        <div className="col-span-7 bg-[#00000007] py-2 text-[#474747]">Images</div>
        <div className="col-span-2 bg-[#00000007] py-2 pr-1 text-center text-[#474747]">
          <div className="flex items-center justify-center gap-2">
            <span>Action</span>
            <button
              type="button"
              onClick={openCreateProductModal}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-base text-blue-600 transition hover:border-blue-300 hover:bg-blue-100"
              title="Create product"
            >
              <span aria-hidden="true">+</span>
              <span className="sr-only">Create product</span>
            </button>
          </div>
        </div>

        <div
          className="col-span-24 flex-grow overflow-y-auto bg-[#ffffff80] scrollbar-hidden"
          style={{ maxHeight: "calc(100vh - 280px)" }}
        >
          {products.length === 0 ? (
            <div className="bg-[#ffffff70] py-3 text-center text-[#474747]">
              There are no products.
            </div>
          ) : (
            products.map((prd, index) => {
              const level = 0;
              const indexStr = String(index + 1);
              const isOpen = openIds.includes(prd.product_id);
              const totalStock =
                prd.variants?.reduce((acc, v) => acc + (v.stock ?? 0), 0) ?? 0;

              return (
                <div key={`product-${prd.product_id}`} className="w-full">
                  <div
                    className="grid grid-cols-24 items-center border-t border-[#00000008] py-3 text-[#474747]"
                    style={{ backgroundColor: getBgForLevel(level) }}
                  >
                    <div className="col-span-1 flex items-center justify-center py-2">
                      {indexStr}
                    </div>
                    <div className="col-span-7 flex items-center gap-2 py-2 pl-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCreateProductModal();
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-base text-blue-600 transition hover:border-blue-300 hover:bg-blue-100 md:hidden"
                        aria-label="Create product"
                      >
                        +
                      </button>
                      <div
                        className="flex flex-1 cursor-pointer select-none items-center gap-2"
                        onClick={() => {
                          if (prd.variants && prd.variants.length > 0) {
                            toggleOpen(prd.product_id);
                          }
                        }}
                      >
                        {prd.variants && prd.variants.length > 0 && (
                          <PlusMinusIcon isOpen={isOpen} />
                        )}
                        <span className="truncate">{prd.name}</span>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center justify-center py-2">
                      {prd.brand || "-"}
                    </div>
                    <div className="col-span-3 flex items-center justify-center py-2">
                      {prd.category_name || "-"}
                    </div>
                    <div className="col-span-2 flex items-center justify-center py-2">
                      {totalStock}
                    </div>
                    <div className="col-span-7 flex items-center overflow-hidden py-2">
                      {renderImages(prd.imageurls)}
                    </div>
                    <div className="col-span-2 flex items-center justify-center py-2">
                      <ProductAction
                        onEdit={() => openEditProductModal(prd)}
                        onAddVariant={() => openCreateVariantModal(prd)}
                        onDelete={() => setProductToDelete(prd)}
                      />
                    </div>
                  </div>

                  {prd.variants && prd.variants.length > 0 && (
                    <Expando open={isOpen} duration={260}>
                      <div className="border-t border-gray-200 bg-[#fafafa] pl-2">
                        <div
                          className="grid grid-cols-22 items-center border-t border-[#00000008] text-[#474747]"
                          style={{ backgroundColor: getBgForLevel(1) }}
                        >
                          <div className="col-span-1 flex items-center justify-center py-2">
                            #
                          </div>
                          <div className="col-span-9 flex items-center py-2 pl-1">
                            Variant Details
                          </div>
                          <div className="col-span-2 flex items-center justify-center py-2">
                            Price
                          </div>
                          <div className="col-span-3 flex items-center justify-center py-2">
                            Input Price
                          </div>
                          <div className="col-span-2 flex items-center justify-center py-2">
                            Stock
                          </div>
                          <div className="col-span-2 flex items-center justify-center py-2">
                            Sold
                          </div>
                          <div className="col-span-3 flex items-center justify-center py-2">
                            Action
                          </div>
                        </div>
                        {prd.variants.map((variant, j) => (
                          <div key={variant.variant_id} className="block">
                            {renderVariant(variant, j + 1, level + 1, indexStr, {
                              onEdit: (selected) =>
                                openEditVariantModal(prd, selected),
                              onDelete: (selected) => {
                                ensureRowExpanded(prd.product_id);
                                setVariantToDelete({
                                  product: prd,
                                  variant: selected,
                                });
                              },
                            })}
                          </div>
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

      <div className="mb-1 flex h-10 items-center justify-center">
        <Pagination
          totalPage={Math.max(1, Math.ceil(totalItem / 30))}
          page={isPage}
          totalProduct={totalItem}
          onChangePage={(val) => setIsPage(val)}
        />
      </div>

      <ProductUpsertModal
        open={productModalOpen}
        mode={productModalMode}
        brands={brands}
        categories={listCate}
        product={editingProduct ?? undefined}
        submitting={productModalSubmitting}
        error={productModalError}
        onClose={() => {
          if (!productModalSubmitting) {
            setProductModalOpen(false);
            setEditingProduct(null);
          }
        }}
        onSubmit={handleProductSubmit}
      />

      <VariantUpsertModal
        open={variantModalOpen}
        mode={variantModalMode}
        variant={variantContext?.variant}
        productName={variantContext?.product.name}
        submitting={variantModalSubmitting}
        error={variantModalError}
        onClose={() => {
          if (!variantModalSubmitting) {
            setVariantModalOpen(false);
            setVariantContext(null);
          }
        }}
        onSubmit={handleVariantSubmit}
      />

      <ChooseModule
        text="Are you sure you want to delete this product?"
        styleYes="bg-[#ff000095] text-white"
        open={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onYes={handleConfirmDeleteProduct}
      />

      <ChooseModule
        text="Remove this variant from the product?"
        styleYes="bg-[#ff000095] text-white"
        open={!!variantToDelete}
        onClose={() => setVariantToDelete(null)}
        onYes={handleConfirmDeleteVariant}
      />
    </div>
  );
}
