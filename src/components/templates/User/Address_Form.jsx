"use client";
import { useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";

export default function AddressForm() {
  const [open, setOpen] = useState(false);

  const addresses = [
    {
      type: "Billing Address",
      name: "Sofia Havertz",
      phone: "(+1) 234 567 890",
      address: "345 Long Island, NewYork, United States",
    },
    {
      type: "Shipping Address",
      name: "Sofia Havertz",
      phone: "(+1) 234 567 890",
      address: "345 Long Island, NewYork, United States",
    },
    {
      type: "Billing Address",
      name: "Sofia Havertz",
      phone: "(+1) 234 567 890",
      address: "345 Long Island, NewYork, United States",
    },
    {
      type: "Shipping Address",
      name: "Sofia Havertz",
      phone: "(+1) 234 567 890",
      address: "345 Long Island, NewYork, United States",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center mb-6">
        <img
          src="https://res.cloudinary.com/do0im8hgv/image/upload/v1757949103/image_3_f2tien.png"
          alt=""
          className="w-[43px] h-[43px] mr-3"
        />
        <h2 className="text-xl font-semibold text-[25px]">Account Details</h2>
        <button
          onClick={() => setOpen(true)}
          className="ml-auto text-black hover:text-[#29c9d7] transition-colors duration-300"
        >
          <IoAddCircleOutline className="w-[35px] h-[35px]" />
        </button>
      </div>

      {/* Address Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((item, index) => (
          <div
            key={index}
            className="relative border rounded-lg p-4 shadow-sm bg-white"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{item.type}</h3>
              <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 text-sm">
                <div className="flex items-center gap-1">
                  <CiEdit className="w-[16px] h-[16px]" />
                  <span className="text-[16px] font-semibold">Edit</span>
                </div>
              </button>
            </div>

            {/* Body */}
            <div className="text-[14px] text-gray-700 space-y-1 font-sans">
              <p>{item.name}</p>
              <p>{item.phone}</p>
              <p>{item.address}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Save button */}
      <div className="mt-6">
        <button className="relative inline-block px-6 py-2 font-semibold text-white bg-blue-600 rounded-md overflow-hidden group">
          <span className="absolute inset-0 bg-[#29c9d7] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
          <span className="relative z-10">Save address</span>
        </button>
      </div>

      {/* Popup Add */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <h3 className="text-lg font-semibold mb-4">Địa chỉ mới</h3>

            {/* Form */}
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  className="w-full border rounded p-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  className="w-full border rounded p-2 text-sm"
                />
              </div>

              <select className="w-full border rounded p-2 text-sm">
                <option>Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã</option>
              </select>

              <input
                type="text"
                placeholder="Địa chỉ cụ thể"
                className="w-full border rounded p-2 text-sm"
              />
              <div>
                <p className="text-sm font-medium mb-2">Loại địa chỉ:</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="border px-4 py-2 rounded hover:bg-gray-100"
                  >
                    Nhà Riêng
                  </button>
                  <button
                    type="button"
                    className="border px-4 py-2 rounded hover:bg-gray-100"
                  >
                    Văn Phòng
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="default" />
                <label htmlFor="default" className="text-sm">
                  Đặt làm địa chỉ mặc định
                </label>
              </div>

              {/* Nút hành động */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Trở Lại
                </button>
                <button
                  type="submit"
                  className="relative inline-block px-6 py-2 font-semibold text-white bg-blue-600 rounded overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-[#29c9d7] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                  <span className="relative z-10">Hoàn thành</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
