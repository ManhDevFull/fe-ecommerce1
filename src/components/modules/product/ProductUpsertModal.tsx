"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import type { CategoryTree, IProductAdmin } from "@/types/type";
import type { BrandItem } from "@/components/templates/Admin/filterProduct";

export type ProductFormSubmit = {
  name: string;
  description: string;
  brandId: number;
  categoryId: number;
  imageUrls: string[];
};

type FormState = {
  name: string;
  description: string;
  brandId: string;
  categoryId: string;
  imageText: string;
};

function flattenCategories(
  tree: CategoryTree[],
  level = 0,
  out: { value: string; label: string }[] = []
) {
  const pad = "— ".repeat(level);
  for (const node of tree) {
    out.push({
      value: String(node.id),
      label: `${pad}${node.namecategory}`,
    });
    if (node.children?.length) {
      flattenCategories(node.children, level + 1, out);
    }
  }
  return out;
}

export interface ProductUpsertModalProps {
  open: boolean;
  mode: "create" | "edit";
  brands: BrandItem[];
  categories: CategoryTree[];
  product?: IProductAdmin | null;
  submitting?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: ProductFormSubmit) => Promise<void> | void;
}

export default function ProductUpsertModal({
  open,
  mode,
  brands,
  categories,
  product,
  submitting = false,
  error,
  onClose,
  onSubmit,
}: ProductUpsertModalProps) {
  const categoryOptions = useMemo(
    () => [{ value: "", label: "--- Select ---" }, ...flattenCategories(categories)],
    [categories]
  );

  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    brandId: "",
    categoryId: "",
    imageText: "",
  });
  const [formError, setFormError] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && product) {
      const brandMatch = brands.find((b) => b.name === product.brand);
      setForm({
        name: product.name ?? "",
        description: product.description ?? "",
        brandId: brandMatch ? String(brandMatch.id) : "",
        categoryId: product.category_id ? String(product.category_id) : "",
        imageText: Array.isArray(product.imageurls) ? product.imageurls.join("\n") : "",
      });
    } else {
      setForm({
        name: "",
        description: "",
        brandId: "",
        categoryId: "",
        imageText: "",
      });
    }
    setFormError("");
  }, [open, mode, product, brands]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim()) {
      setFormError("Product name is required.");
      return;
    }
    if (!form.brandId) {
      setFormError("Please select a brand.");
      return;
    }
    if (!form.categoryId) {
      setFormError("Please select a category.");
      return;
    }

    const payload: ProductFormSubmit = {
      name: form.name.trim(),
      description: form.description.trim(),
      brandId: Number(form.brandId),
      categoryId: Number(form.categoryId),
      imageUrls: form.imageText
        .split(/\r?\n|,/)
        .map((url) => url.trim())
        .filter((url) => !!url),
    };

    await onSubmit(payload);
  };

  const modalTitle = mode === "create" ? "Create Product" : "Edit Product";

  return (
    <Modal
      open={open}
      onClose={submitting ? () => undefined : onClose}
      variant="centered"
      showOverlay
      showCloseButton={!submitting}
      size="xl"
      className="max-h-[90vh]"
    >
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <ModalHeader>
          <h2 className="text-lg font-semibold">{modalTitle}</h2>
        </ModalHeader>
        <ModalBody className="gap-4">
          {(formError || error) && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {formError || error}
            </div>
          )}

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="h-9 w-full rounded-md border border-gray-300 px-3 outline-none focus:border-gray-500"
              placeholder="Product name"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Brand</span>
            <select
              value={form.brandId}
              onChange={(e) => handleChange("brandId", e.target.value)}
              className="h-9 w-full rounded-md border border-gray-300 px-2 outline-none focus:border-gray-500"
            >
              <option value="">--- Select ---</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Category</span>
            <select
              value={form.categoryId}
              onChange={(e) => handleChange("categoryId", e.target.value)}
              className="h-9 w-full rounded-md border border-gray-300 px-2 outline-none focus:border-gray-500"
            >
              {categoryOptions.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="min-h-[90px] w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
              placeholder="Product description"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Image URLs</span>
            <textarea
              value={form.imageText}
              onChange={(e) => handleChange("imageText", e.target.value)}
              className="min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm outline-none focus:border-gray-500"
              placeholder="One URL per line"
            />
            <span className="text-xs text-gray-500">Enter one URL per line or comma separated.</span>
          </label>
        </ModalBody>
        <ModalFooter className="justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : mode === "create" ? "Create" : "Save changes"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
