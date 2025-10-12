"use client";

import { useRouter } from "next/dist/client/components/navigation";

export default function OrderHistory() {
  const router = useRouter();

  const orders = [
    {
      id: "#3456_768",
      date: "October 17, 2023",
      status: "Delivered",
      price: "$1234.00",
    },
    {
      id: "#3456_9B0",
      date: "October 11, 2023",
      status: "Delivered",
      price: "$345.00",
    },
    {
      id: "#3456_120",
      date: "August 24, 2023",
      status: "Delivered",
      price: "$2345.00",
    },
    {
      id: "#3456_030",
      date: "August 12, 2023",
      status: "Delivered",
      price: "$845.00",
    },
  ];

  const handleRowClick = (orderId: string) => {
    const cleanId = orderId.replace("#", "");
    router.push(`/user/${cleanId}`);
  };
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <img
          src="https://res.cloudinary.com/do0im8hgv/image/upload/v1757949098/image_2_h5wwjb.png"
          alt=""
          className="w-[43px] h-[43px] mr-3"
        />
        <h2 className="text-xl font-semibold text-[25px]">Orders History</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-['Public Sans'] text-[14px]">
          <thead>
            <tr className="border-b border-[#E8ECEF] text-gray-700">
              <th className="py-3 px-4 font-bold">Number ID</th>
              <th className="py-3 px-4 font-bold">Dates</th>
              <th className="py-3 px-4 font-bold">Status</th>
              <th className="py-3 px-4 font-bold">Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={index}
                onClick={() => handleRowClick(order.id)}
                className="border-b border-[#E8ECEF] cursor-pointer hover:bg-gray-50 transition-colors duration-300 text-gray-700 font-normal"
              >
                <td className="py-3 px-4">{order.id}</td>
                <td className="py-3 px-4">{order.date}</td>
                <td className="py-3 px-4 text-green-600">{order.status}</td>
                <td className="py-3 px-4">{order.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Button */}
      <div className="mt-8 flex justify-left">
        <button
          onClick={() => alert("Redirect to enquiry form")}
          className="relative inline-block px-6 py-3 font-semibold text-white bg-blue-600 rounded-md overflow-hidden group"
        >
          <span className="absolute inset-0 bg-[#29c9d7] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
          <span className="relative z-10">
            What to enquire about your order?
          </span>
        </button>
      </div>
    </div>
  );
}
