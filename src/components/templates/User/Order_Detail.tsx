"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import handleAPI from "@/axios/handleAPI";
import ReviewDetailModal from "@/components/modules/review/ReviewDetailModalClient";

interface OrderAddressInfo {
  title: string;
  nameRecipient: string;
  tel: string;
  detail?: string;
  description?: string;
  fullAddress: string;
}

interface ProductInfo {
  name: string;
  thumbnail: string;
  variantAttributes?: Record<string, string>;
}

interface OrderItem {
  id: number;
  variantId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  canReview?: boolean;
  product: ProductInfo;
}

interface OrderDetailData {
  orderId: number;
  orderDate: string;
  statusOrder: string;
  typePay: string;
  statusPay: string;
  totalPrice: number;
  totalDiscount: number;
  totalPriceAfterDiscount: number;
  addressInfo: OrderAddressInfo;
  items: OrderItem[];
}

interface OrderDetailProps {
  orderId: string;
  onBack?: () => void;
}

export default function OrderDetail({ orderId, onBack }: OrderDetailProps) {
  const [orderDetail, setOrderDetail] = useState<OrderDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItemForReview, setSelectedItemForReview] = useState<OrderItem | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState<{ reviewId: number; rating: number; content: string; images: string[] } | null>(null);
  const [isFetchingReview, setIsFetchingReview] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is invalid.");
      setIsLoading(false);
      return;
    }

    const fetchOrderDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response: any = await handleAPI(`/Order/my-orders/${orderId}`, undefined, "get");
        setOrderDetail(response);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || "Cannot load order detail.";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const formatPrice = (price: number) => {
    return (price ?? 0).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const renderVariantAttributes = (attrs?: Record<string, string>) => {
    if (!attrs) return null;
    return Object.entries(attrs)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
  };

  const handleOpenReview = (item: OrderItem) => {
    setReviewData(null);
    setSelectedItemForReview(item);
    setIsReviewModalOpen(true);
  };

  const handleViewExistingReview = async (item: OrderItem) => {
    setIsFetchingReview(true);
    try {
      const res: any = await handleAPI(`api/Review/by-order-detail/${item.id}`, undefined, "get");
      setReviewData({
        reviewId: res.reviewId,
        rating: res.rating,
        content: res.content,
        images: res.images ?? [],
      });
      setSelectedItemForReview(item);
      setIsReviewModalOpen(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Cannot load review.");
    } finally {
      setIsFetchingReview(false);
    }
  };

  const renderReviewAction = (item: OrderItem) => {
    const delivered = (orderDetail?.statusOrder ?? "").trim().toUpperCase() === "DELIVERED";

    if (!delivered) {
      return <span className="text-sm text-gray-400">Awaiting delivery</span>;
    }

    if (!item.canReview) {
      return (
        <button
          disabled={isFetchingReview}
          onClick={() => handleViewExistingReview(item)}
          className="text-sm font-medium text-green-600 hover:text-green-700 underline disabled:opacity-60"
        >
          View / Edit review
        </button>
      );
    }

    return (
      <button
        onClick={() => handleOpenReview(item)}
        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
      >
        Write review
      </button>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white shadow rounded-lg border border-gray-200 text-center">
        Loading order detail #{orderId}...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white shadow rounded-lg border border-gray-200 text-center text-red-500">
        <p>Error: {error}</p>
        {onBack && (
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Back
          </button>
        )}
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="p-6 bg-white shadow rounded-lg border border-gray-200 text-center text-gray-500">
        No data found for order #{orderId}.
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span className="text-lg">←</span>
            <span>Back to Order History</span>
          </button>
        ) : (
          <span className="text-sm text-gray-500">Order Details</span>
        )}
      </div>

      <div className="flex justify-center items-center text-center mb-6 bg-blue-50 px-4 py-3 border border-blue-200 rounded-lg">
        <div className="text-base font-semibold text-blue-700">Items Ordered</div>
      </div>

      <div className="mb-6">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left pb-2">Product Name</th>
              <th className="text-left pb-2">Price</th>
              <th className="text-left pb-2">Qty</th>
              <th className="text-left pb-2">Subtotal</th>
              <th className="text-center pb-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {(orderDetail?.items ?? []).map((item, index) => (
              <tr key={item.id || index} className="border-t border-gray-200">
                <td className="py-2">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product?.thumbnail || "/placeholder.png"}
                      alt={item.product?.name || "Product Image"}
                      className="w-16 h-16 rounded object-cover border"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/64?text=No+Img";
                      }}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{item.product?.name}</span>
                      {item.product?.variantAttributes && (
                        <span className="text-gray-500 text-sm capitalize">
                          {renderVariantAttributes(item.product.variantAttributes)}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-2 align-middle">{formatPrice(item.unitPrice)}</td>
                <td className="py-2 align-middle">{item.quantity}</td>
                <td className="py-2 align-middle font-medium">
                  {formatPrice(item.unitPrice * item.quantity)}
                </td>
                <td className="py-2 align-middle text-center">{renderReviewAction(item)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Order Information</h3>
          <p>Sub Total: {formatPrice(orderDetail.totalPrice)}</p>
          <p>Discount: -{formatPrice(orderDetail.totalDiscount)}</p>
          <p>Delivery Fee: {formatPrice(0)}</p>
          <p className="font-semibold mt-2 pt-2 border-t">
            Grand Total: {formatPrice(orderDetail.totalPriceAfterDiscount)}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Payment Details</h3>
          <p>Method: {orderDetail.typePay}</p>
          <p>
            Status: <span className="font-medium text-blue-600">{orderDetail.statusPay}</span>
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Address Details</h3>
          <p className="font-medium">{orderDetail.addressInfo?.nameRecipient}</p>
          <p>{orderDetail.addressInfo?.tel}</p>
          <p className="text-sm text-gray-600">
            {orderDetail.addressInfo?.fullAddress ||
              [orderDetail.addressInfo?.detail, orderDetail.addressInfo?.description, "Việt Nam"]
                .filter((x) => x && x.trim().length > 0)
                .join(", ")}
          </p>
        </div>
      </div>

      <div className="flex gap-4 mt-8 justify-end">
        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
          Reorder
        </button>
      </div>

      {isReviewModalOpen && selectedItemForReview && (
        <ReviewDetailModal
          open={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          productName={selectedItemForReview.product.name}
          productImage={selectedItemForReview.product.thumbnail}
          orderDetailId={selectedItemForReview.id}
          reviewId={reviewData?.reviewId}
          initialRating={reviewData?.rating}
          initialContent={reviewData?.content}
          initialImages={reviewData?.images}
          onSuccess={() => {
            toast.success("Review saved!");
          }}
        />
      )}
    </div>
  );
}
