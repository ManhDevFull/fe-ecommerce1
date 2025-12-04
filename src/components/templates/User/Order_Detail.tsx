"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import handleAPI from "@/axios/handleAPI";
import ReviewDetailModal from "@/components/modules/review/ReviewDetailModalClient";

// --- 1. Cập nhật Type khớp với dữ liệu Log của bạn ---
interface OrderAddressInfo {
  title: string;
  nameRecipient: string;
  tel: string;
  fullAddress: string;
}

// Interface cho Product lồng bên trong
interface ProductInfo {
  name: string;
  thumbnail: string;
  // variantAttributes trả về Object, không phải String
  variantAttributes?: Record<string, string>;
}

interface OrderItem {
  id: number;
  variantId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  // Quan trọng: Dữ liệu nằm trong object product
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
// ----------------------------------------------------

interface OrderDetailProps {
  orderId: string;
  onBack?: () => void;
}

export default function OrderDetail({ orderId, onBack }: OrderDetailProps) {
  const [orderDetail, setOrderDetail] = useState<OrderDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItemForReview, setSelectedItemForReview] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID không hợp lệ.");
      setIsLoading(false);
      return;
    }

    const fetchOrderDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response: any = await handleAPI(
          `/Order/my-orders/${orderId}`,
          undefined,
          "get"
        );
        console.log("OrderDetail Items:", response.items);
        // console.log("Fetched order detail:", response); // Debug xong có thể comment
        setOrderDetail(response);
      } catch (err: any) {
        console.error("Error fetching order detail:", err);
        const errorMsg =
          err.response?.data?.message || "Không thể tải chi tiết đơn hàng.";
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
      currency: "USD", // Hoặc "VND"
    });
  };

  // --- Hàm helper để hiển thị variant từ Object ---
  const renderVariantAttributes = (attrs?: Record<string, string>) => {
    if (!attrs) return null;
    // Biến object {color: 'blue', rom: '128GB'} thành chuỗi "color: blue, rom: 128GB"
    return Object.entries(attrs)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
  };

  const handleOpenReview = (item: any) => {
    console.log("🛠 DATA ITEM CHUẨN BỊ REVIEW:", item);
    console.log("OrderDetailId gửi lên API:", item.id);
    setSelectedItemForReview(item);
    setIsReviewModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white shadow rounded-lg border border-gray-200 text-center">
        Đang tải chi tiết đơn hàng #{orderId}...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white shadow rounded-lg border border-gray-200 text-center text-red-500">
        <p>Lỗi: {error}</p>
        {onBack && (
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Quay lại
          </button>
        )}
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="p-6 bg-white shadow rounded-lg border border-gray-200 text-center text-gray-500">
        Không tìm thấy dữ liệu cho đơn hàng #{orderId}.
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow rounded-lg border border-gray-200">
      {/* Tabs */}
      <div className="flex justify-between items-center text-center mb-6 bg-[#F1F1F1] px-4 py-2 border border-[#E8ECEF] rounded-lg">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Items Ordered
        </button>
      </div>

      {/* Items Table */}
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
            {(orderDetail?.items ?? []).map((item, index) => {
              return (
                <tr
                  key={item.id || index}
                  className="border-t border-gray-200"
                >
                  <td className="py-2">
                    <div className="flex items-center gap-4">
                      {/* --- SỬA LOGIC HIỂN THỊ ẢNH --- */}
                      <img
                        src={item.product?.thumbnail || "/placeholder.png"}
                        alt={item.product?.name || "Product Image"}
                        className="w-16 h-16 rounded object-cover border"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/64?text=No+Img";
                        }}
                      />

                      <div className="flex flex-col">
                        {/* --- SỬA LOGIC HIỂN THỊ TÊN --- */}
                        <span className="font-medium">{item.product?.name}</span>

                        {/* --- SỬA LOGIC HIỂN THỊ VARIANT (Object -> String) --- */}
                        {item.product?.variantAttributes && (
                          <span className="text-gray-500 text-sm capitalize">
                            {renderVariantAttributes(item.product.variantAttributes)}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-2 align-middle">
                    {formatPrice(item.unitPrice)}
                  </td>

                  <td className="py-2 align-middle">{item.quantity}</td>

                  <td className="py-2 align-middle font-medium">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </td>

                  <td className="py-2 align-middle font-medium">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </td>

                  {/* 👇 THÊM CỘT NÀY VÀO SAU CÙNG TRONG THẺ <tr> 👇 */}
                  <td className="py-2 align-middle text-center">
                    <button
                      onClick={() => handleOpenReview(item)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      Viết đánh giá
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Order Information */}
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
          <p>Hình thức: {orderDetail.typePay}</p>
          <p>Trạng thái: <span className="font-medium text-blue-600">{orderDetail.statusPay}</span></p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Address Details</h3>
          <p className="font-medium">{orderDetail.addressInfo?.nameRecipient}</p>
          <p>{orderDetail.addressInfo?.tel}</p>
          <p className="text-sm text-gray-600">{orderDetail.addressInfo?.fullAddress}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-8 justify-end">
        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
          Reorder
        </button>
      </div>

      {/* 👇 THÊM ĐOẠN NÀY VÀO CUỐI CÙNG 👇 */}
      {isReviewModalOpen && selectedItemForReview && (
        <ReviewDetailModal
          open={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          productName={selectedItemForReview.product.name}
          productImage={selectedItemForReview.product.thumbnail}
          orderDetailId={selectedItemForReview.id}
          onSuccess={() => {
            toast.success("Đánh giá thành công!");
          }}
        />
      )}
    </div>
  );
}