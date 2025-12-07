import { useCallback, useEffect, useState } from "react";
import {
  WishlistItem,
  addWishlist,
  getWishlist,
  removeWishlist,
} from "@/axios/wishlist";

type UseWishlistResult = {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  has: (productId: number) => boolean;
  add: (productId: number) => Promise<void>;
  remove: (productId: number) => Promise<void>;
  toggle: (productId: number) => Promise<void>;
  refresh: () => Promise<void>;
};

export function useWishlist(): UseWishlistResult {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWishlist();
      setItems(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const has = useCallback(
    (productId: number) => items.some((i) => i.productId === productId),
    [items]
  );

  const add = useCallback(async (productId: number) => {
    try {
      const data = await addWishlist(productId);
      setItems(data);
    } catch (e) {
      throw e;
    }
  }, []);

  const remove = useCallback(
    async (productId: number) => {
      const prev = items;
      setItems(prev.filter((i) => i.productId !== productId));
      try {
        const data = await removeWishlist(productId);
        setItems(data);
      } catch (e) {
        setItems(prev);
        throw e;
      }
    },
    [items]
  );

  const toggle = useCallback(
    async (productId: number) => {
      if (has(productId)) {
        await remove(productId);
      } else {
        await add(productId);
      }
    },
    [add, has, remove]
  );

  return { items, loading, error, has, add, remove, toggle, refresh };
}
