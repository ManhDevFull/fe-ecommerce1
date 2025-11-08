"use client";
// ✅ 1. Thêm import
import { useEffect, useState } from "react";
import { toast } from "sonner";
import handleAPI from "@/axios/handleAPI";
import { FaArrowLeft } from "react-icons/fa"; // Thêm icon (nếu bạn muốn dùng cho loading/error)

// ✅ 2. Định nghĩa Interface (dựa trên API)
interface OrderAddressInfo {
  title: string;
  nameRecipient: string;
  tel: string;
  fullAddress: string;
}

interface OrderItem {
  orderDetailId: number;
  nameProduct: string;
  imageUrl: string;
  valueVariant: string; // Đây là "Category" (COAT) trong code tĩnh của bạn
  quantity: number;
  price: number;
}

interface OrderDetailData {
  orderId: number;
  orderDate: string;
  statusOrder: string;
  typePay: string;
  statusPay: string;
  totalPrice: number; // Sub Total
  totalDiscount: number; // Discount
  totalPriceAfterDiscount: number; // Grand Total
  addressInfo: OrderAddressInfo;
  items: OrderItem[];
}
// ---

interface OrderDetailProps {
  orderId: string;
  onBack?: () => void;
}

export default function OrderDetail({ orderId, onBack }: OrderDetailProps) {
  
  // ✅ 3. Thêm State để gọi API
  const [orderDetail, setOrderDetail] = useState<OrderDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ 4. Thêm useEffect để gọi API
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
          `/Order/my-orders/${orderId}`, // Dùng endpoint mới
          undefined,
          "get"
        );
        console.log("Fetched order detail:", response);
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

  // ✅ 5. Thêm hàm Helper (vì API trả về số, không phải chuỗi "$")
  const formatPrice = (price: number) => {
    return (price ?? 0).toLocaleString("en-US", { 
      style: "currency", 
      currency: "USD" // (Hoặc VND tùy bạn)
    });
  };

  // ✅ 6. Thêm trạng thái Loading
  if (isLoading) {
    return (
      <div className="p-6 bg-white shadow rounded-lg border border-gray-200 text-center">
        Đang tải chi tiết đơn hàng #{orderId}...
      </div>
    );
  }

  // ✅ 7. Thêm trạng thái Lỗi
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

  // ✅ 8. Thêm trạng thái Không tìm thấy
  if (!orderDetail) {
    return (
      <div className="p-6 bg-white shadow rounded-lg border border-gray-200 text-center text-gray-500">
        Không tìm thấy dữ liệu cho đơn hàng #{orderId}.
      </div>
    );
  }

  // ✅ 9. SỬA LẠI PHẦN RETURN (dùng 'orderDetail' từ API, xóa 'const order' tĩnh)
  return (
    <div className="p-6 bg-white shadow rounded-lg border border-gray-200">
      {/* Tabs (Giữ nguyên) */}
      <div className="flex justify-between items-center text-center mb-6 bg-[#F1F1F1] px-4 py-2 border border-[#E8ECEF] rounded-lg">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Items Ordered
        </button>
        <button className="px-4 py-2 text-gray-600">Invoices</button>
        <button className="px-4 py-2 text-gray-600">Order Shipment</button>
      </div>

      {/* Items Table (Dùng dữ liệu API) */}
      <div className="mb-6">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left pb-2">Product Name</th>
              <th className="text-left pb-2">Price</th>
              <th className="text-left pb-2">Qty</th>
              <th className="text-left pb-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {/* Dùng (orderDetail.items ?? []).map để tránh lỗi 'map' of undefined */}
            {(orderDetail.items ?? []).map((item) => (
              <tr key={item.orderDetailId} className="border-t border-gray-200">
                <td className="py-2 flex items-center gap-4">
                  <img
                    src={item.imageUrl} // API data
                    alt={item.nameProduct} // API data
                    className="w-16 h-16 rounded object-cover border"
                  />
                  <span>
                    {item.nameProduct} {/* API data */}
                    <span className="text-gray-500">{item.valueVariant}</span> {/* API data */}
                  </span>
                </td>
                <td className="py-2">{formatPrice(item.price)}</td> {/* API data */}
                <td className="py-2">{item.quantity}</td> {/* API data */}
                <td className="py-2">
                  {formatPrice(item.price * item.quantity)} {/* Tự tính Subtotal */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Information (Dùng dữ liệu API) */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Order Information</h3>
          <p>Sub Total: {formatPrice(orderDetail.totalPrice)}</p>
          <p>Discount: -{formatPrice(orderDetail.totalDiscount)}</p>
          <p>Delivery Fee: {formatPrice(0)}</p> {/* (API không có, tạm để 0) */}
          <p className="font-semibold">
            Grand Total: {formatPrice(orderDetail.totalPriceAfterDiscount)}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Payment Details</h3>
          <p>Hình thức: {orderDetail.typePay}</p>
          <p>Trạng thái: {orderDetail.statusPay}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Address Details</h3>
          {/* Dùng optional chaining (?.) để tránh lỗi crash nếu addressInfo là null */}
          <p>{orderDetail.addressInfo?.nameRecipient}</p>
          <p>{orderDetail.addressInfo?.tel}</p>
          <p>{orderDetail.addressInfo?.fullAddress}</p>
          <p>#{orderId}</p> {/* Giữ nguyên ID */}
        </div>
      </div>

      {/* Buttons (Giữ nguyên) */}
      <div className="flex gap-4 mt-6 justify-end">
        <button className="relative inline-block px-6 py-3 font-semibold text-white bg-blue-600 rounded-md overflow-hidden group">
          <span className="absolute inset-0 bg-[#29c9d7] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
          <span className="relative z-10">Reorder</span>
        </button>
        <button className="relative inline-block px-6 py-3 font-semibold text-white bg-blue-600 rounded-md overflow-hidden group">
          <span className="absolute inset-0 bg-[#29c9d7] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
          <span className="relative z-10">Add Rating</span>
        </button>
      </div>
    </div>
  );
}