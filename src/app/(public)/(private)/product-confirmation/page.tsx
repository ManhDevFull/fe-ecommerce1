'use client';
import BackNavigation from "@/components/ui/BackNavigation";
import NavigationPath from "@/components/ui/NavigationPath";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { GrFormNextLink } from "react-icons/gr";
import { IoLogoBuffer } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import handleAPI from "@/axios/handleAPI";

type PaymentStatus = 'checking' | 'success' | 'failed' | 'pending' | 'error';

export default function ProductConfirmation() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('checking');
    const [orderId, setOrderId] = useState<string | null>(null);
    const [message, setMessage] = useState<string>('Đang kiểm tra trạng thái thanh toán...');

    useEffect(() => {
        const verifyAndConfirmOrder = async () => {
            // Lấy orderId từ nhiều nguồn:
            // 1. URL query params (MoMo redirect về với orderId)
            // 2. localStorage (lưu khi tạo payment)
            const orderIdFromUrl = searchParams.get('orderId') || searchParams.get('order_id');
            const orderIdFromStorage = typeof window !== 'undefined' 
                ? localStorage.getItem('lastPaymentOrderId') 
                : null;
            
            const orderIdParam = orderIdFromUrl || orderIdFromStorage;
            
            if (!orderIdParam) {
                setPaymentStatus('error');
                setMessage('Không tìm thấy thông tin đơn hàng. Vui lòng kiểm tra lại.');
                return;
            }

            setOrderId(orderIdParam);
            
            // Xóa orderId khỏi localStorage sau khi đã sử dụng
            if (typeof window !== 'undefined' && orderIdFromStorage) {
                localStorage.removeItem('lastPaymentOrderId');
            }

            try {
                // Gọi endpoint mới: backend tự động verify và tạo order
                const response = await handleAPI(
                    `/payment/verify-and-confirm/${orderIdParam}`,
                    undefined,
                    'post'
                );
                
                const result = (response as any)?.data ?? response;

                if (result?.success) {
                    if (result?.orderCreated) {
                        setPaymentStatus('success');
                        setMessage(result?.message || 'Đơn hàng của bạn đã được đặt thành công!');
                    } else {
                        setPaymentStatus('success');
                        setMessage(result?.message || 'Thanh toán thành công.');
                    }
                } else {
                    const status = result?.status?.toUpperCase();
                    if (status === 'FAILED') {
                        router.push('/product-confirmation-error');
                        return;
                    } else {
                        setPaymentStatus('error');
                        setMessage(result?.message || 'Không thể xác định trạng thái thanh toán.');
                    }
                }
            } catch (error: any) {
                console.error('Error verifying and confirming order:', error);
                router.push('/product-confirmation-error');
                return;
            }
        };

        verifyAndConfirmOrder();
    }, [searchParams]);

    const getStatusIcon = () => {
        switch (paymentStatus) {
            case 'success':
                return <IoIosCheckmarkCircleOutline className="text-green-500 text-6xl mb-4 self-center" />;
            case 'failed':
                return <IoIosCloseCircleOutline className="text-red-500 text-6xl mb-4 self-center" />;
            case 'checking':
            case 'pending':
                return <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 self-center" />;
            default:
                return <IoIosCloseCircleOutline className="text-orange-500 text-6xl mb-4 self-center" />;
        }
    };

    const getStatusTitle = () => {
        switch (paymentStatus) {
            case 'success':
                return 'Đơn hàng của bạn đã được đặt thành công!';
            case 'failed':
                return 'Thanh toán không thành công';
            case 'checking':
                return 'Đang kiểm tra...';
            case 'pending':
                return 'Đang xử lý thanh toán...';
            default:
                return 'Đã xảy ra lỗi';
        }
    };

    return (
        <main className="min-h-screen">
            <BackNavigation />
            <NavigationPath />

            {/* Title */}
            <div className="max-w-[1000px] mx-auto pt-6">
                <h1 className="font-bold text-5xl sm:text-6xl text-gray-900 mb-2">Product Confirmation</h1>
                <p className="text-2xl text-gray-400 font-normal">Xác nhận đơn hàng</p>
            </div>

            <div className="max-w-[1000px] mx-auto mt-10 flex flex-col md:flex-row items-center justify-center gap-30">
                <div className="flex-1 flex justify-center">
                    <img
                        src="https://res.cloudinary.com/do0im8hgv/image/upload/v1758722974/e87b5a38137755e77ecde5dec85f34504e426b41_csmqzy.png"
                        alt="Order Confirmed"
                        className="w-[700px] h-[400px] object-contain"
                    />
                </div>
                <div className="flex-1 flex flex-col items-center md:items-start">
                    {getStatusIcon()}
                    <h2 className="font-bold text-2xl sm:text-3xl mb-2 text-center md:text-center">
                        {getStatusTitle()}
                    </h2>
                    <p className="text-gray-500 text-base mb-6 text-center md:text-center">
                        {message}
                    </p>
                    {orderId && (
                        <p className="text-sm text-gray-400 mb-4 text-center md:text-center">
                            Mã đơn hàng: {orderId}
                        </p>
                    )}
                    {paymentStatus === 'success' && (
                        <div className="flex gap-4 w-full">
                            <button className="flex-1 border-2 border-blue-600 text-blue-600 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-50 transition">
                                <IoLogoBuffer />
                                GO TO DASHBOARD
                            </button>
                            <button className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition">
                                VIEW ORDER <GrFormNextLink className="text-2xl"/>
                            </button>
                        </div>
                    )}
                    {paymentStatus === 'failed' && (
                        <button 
                            onClick={() => window.location.href = '/my-cart'}
                            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                        >
                            QUAY LẠI GIỎ HÀNG
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}