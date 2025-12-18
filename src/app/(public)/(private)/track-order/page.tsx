"use client";
import NavigationPath from "@/components/ui/NavigationPath";
import BackNavigation from "@/components/ui/BackNavigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { trackOrder } from "@/types/type";
import handleAPI from "@/axios/handleAPI";
import { formatCurrency } from "@/utils/currency";
export default function TrackOrder() {
  const router = useRouter()
  // const products = [
  //   {
  //     id: 1,
  //     name: "Jacket",
  //     description: "Coat",
  //     price: 200,
  //     img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1755614948/4eda7f01-e154-4df5-a6bd-ca78c8d1db9c.png",
  //     Qty: 3,
  //     status: "Order Placed",
  //   },
  //   {
  //     id: 2,
  //     name: "Jacket",
  //     description: "Coat",
  //     price: 200,
  //     img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1755592188/93c1a905-070e-430b-825a-2d0fae8b9e6c.png",
  //     Qty: 3,
  //     status: "Packaging",
  //   },
  //   {
  //     id: 3,
  //     name: "Jacket",
  //     description: "Coat",
  //     price: 200,
  //     img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1755614948/4eda7f01-e154-4df5-a6bd-ca78c8d1db9c.png",
  //     Qty: 3,
  //     status: "On The Road",
  //   },
  //   {
  //     id: 4,
  //     name: "Jacket",
  //     description: "Coat",
  //     price: 200,
  //     img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1755614948/4eda7f01-e154-4df5-a6bd-ca78c8d1db9c.png",
  //     Qty: 3,
  //     status: "Delivered",
  //   },
  // ];
  // const activities = [
  //   {
  //     icon: PiChecks,
  //     bg: "bg-green-200",
  //     border: "border-green-400",
  //     textColor: "text-green-600",
  //     content:
  //       "Your order has been delivered. Thank you for shopping at Colicon",
  //     time: "23 Jan, 2021 at 7:32 PM",
  //   },
  //   {
  //     icon: IoMdContact,
  //     bg: "bg-blue-300 ",
  //     border: "border-blue-300",
  //     textColor: "text-blue-600",
  //     content:
  //       "Our delivery man (John Wick) Has picked-up your order for delvery",
  //     time: "23 Jan, 2021 at 2:00 PM",
  //   },
  //   {
  //     icon: FaMapMarkerAlt,
  //     bg: "bg-blue-300 ",
  //     border: "border-blue-300",
  //     textColor: "text-blue-600",
  //     content:
  //       "Our delivery man (John Wick) Has picked-up your order for delvery",
  //     time: "23 Jan, 2021 at 2:00 PM",
  //   },
  //   {
  //     icon: FaMap,
  //     bg: "bg-blue-300 ",
  //     border: "border-blue-300",
  //     textColor: "text-blue-600",
  //     content:
  //       "Our delivery man (John Wick) Has picked-up your order for delvery",
  //     time: "23 Jan, 2021 at 2:00 PM",
  //   },
  //   {
  //     icon: CiCircleCheck,
  //     bg: "bg-green-200",
  //     border: "border-green-400",
  //     textColor: "text-green-600",
  //     content:
  //       "Your order has been delivered. Thank you for shopping at Colicon",
  //     time: "23 Jan, 2021 at 7:32 PM",
  //   },
  //   {
  //     icon: PiNotepadBold,
  //     bg: "bg-blue-300 ",
  //     border: "border-blue-300",
  //     textColor: "text-blue-600",
  //     content:
  //       "Our delivery man (John Wick) Has picked-up your order for delvery",
  //     time: "23 Jan, 2021 at 2:00 PM",
  //   },
  // ];
  const [trackOrder, setTrackOrder] = useState<trackOrder[] | null>(null);

  const orderData = {
    status: "Packaging",
  };
  // const currentStep = steps.findIndex((s) => s.name === orderData.status);
  const [currentStep, setCurrentStep] = useState(Number);
  // type TrackProduct = {
  //   id: number;
  //   status: string;
  //   name: string;
  //   img: string;
  //   description: string;
  //   price: number;
  //   Qty: number;
  // };
  // const [product, setProduct] = useState<TrackProduct | null>(null);
  const index = 0;
  useEffect(() => {
    const fetchTrackorder = async () => {
      try {
        const data: any = await handleAPI("/Order/my-track-order", undefined, "get");
        console.log("track order data: ", data);
        setTrackOrder(data);
      } catch (error: any) {
        if (error.response) console.log("lỗi từ server");
        if (error.request) console.log("không nhận được phản hồi từ server");
      }
    }
    fetchTrackorder();
  }, []);
  return (
    <>
      <main className="w-full relative pt-2">
        <NavigationPath />
        <BackNavigation />
        <div className="w-full px-10 md:px-15 py-2 xl:px-40 ">
          <div className="w-full">
            <h1 className="font-bold text-xl sm:text-2xl">Track Order</h1>
            <p className="text-base sm:text-lg text-stone-600">
              To track your order please enter your order ID in the input field
              below and press the "Track Order" button. This was given to you on
              your receipt and in the confirmation email you should have
              received.
            </p>
          </div>
          <div className="block bg-gray-100 w-full rounded-[8px] mt-4 px-4 pb-2 overflow-x-auto">
            <div className="flex w-full border-b-1 border-[#888888] text-[#5b5b5b]">
              {/* <p className="w-[52%] pl-2 text-left py-2">Product Name</p>
              <p className="w-[16%] text-center py-2">Price</p>
              <p className="w-[16%] text-center py-2">Qty</p>
              <p className="w-[16%] text-center py-2">Subtotal</p> */}
              <p className="w-[4%] text-center py-2">#</p>
              <p className="w-[24%] text-center py-2">Shipping code</p>
              <p className="w-[24%] text-center py-2">Total price</p>
              <p className="w-[24%] text-center py-2">Status</p>
              <p className="w-[24%] text-center py-2">SendDate</p>
            </div>

            {trackOrder && trackOrder.map((product, index) => {
              index++;
              return <>
                <div
                  key={index}
                  className="flex mt-2 p-2 rounded-lg cursor-pointer hover:bg-[#dddddd]"
                  onClick={() =>
                    router.push(`/track-order/${product.idOrder}`)
                  }
                >
                  <div className="w-[4%] flex items-center px-2 text-[#2222]">
                    {index}
                  </div>
                  <div className="w-[24%] flex items-center px-4 justify-center">
                      #{product.idOrder}
                  </div>
                  <div className="w-[24%] flex items-center px-4 justify-center">{formatCurrency(product.totalPrice)}</div>
                  <div className="w-[24%] flex items-center px-4 justify-center">{product.status}</div>
                  <div className="w-[24%] flex items-center px-4 justify-center">{new Date(product.sendorder).toLocaleDateString("vi-VN")}</div>
                </div>
              </>
            }
            )}
          </div>
        </div>
      </main>
    </>
  );
}
