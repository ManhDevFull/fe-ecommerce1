"use client";
import handleAPI from "@/axios/handleAPI";
import { addAuth, type UserAuth } from "@/redux/reducers/authReducer";
import { getPostLoginRoute } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface FormOTPProps {
  email: string;
  fullName: string;
  password: string;
  onBack?: () => void;
}

const RESEND_INTERVAL = 60;

interface ApiSuccessPayload {
  accessToken?: string;
  user?: {
    id?: number;
    name?: string;
    avatarUrl?: string;
    email?: string;
    rule?: number;
    role?: number;
  };
}

interface ApiResponse {
  status?: number;
  data?: ApiSuccessPayload;
  message?: string;
}

export default function FormOTP({ email, fullName, password, onBack }: FormOTPProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_INTERVAL);

  useEffect(() => {
    setCountdown(RESEND_INTERVAL);
    setCode("");
  }, [email]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formattedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  const extractAuthData = (res: ApiResponse): UserAuth => {
    const payload = res?.data ?? {};
    const user = payload?.user ?? {};
    return {
      token: payload?.accessToken,
      name: user?.name,
      avata: user?.avatarUrl,
      email: user?.email,
      id: user?.id,
      role: user?.rule ?? user?.role,
    };
  };

  const applyAuthResult = (res: ApiResponse) => {
    if (!res || res.status !== 200) {
      return false;
    }
    const authData = extractAuthData(res);
    if (!authData?.token) {
      toast.error("Missing authentication token from server response.");
      return false;
    }
    dispatch(addAuth(authData));
    router.replace(getPostLoginRoute(authData.role));
    toast.success("Account verified successfully!");
    return true;
  };

  const getErrorMessage = (error: unknown): string => {
    if (!error) return "Something went wrong. Please try again.";
    const err = error as {
      message?: string;
      data?: { message?: string };
      response?: { data?: { message?: string } };
    };
    return (
      err?.message ??
      err?.data?.message ??
      err?.response?.data?.message ??
      "Something went wrong. Please try again."
    );
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast.warning("Please enter the 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const res = (await handleAPI(
        "Auth/verify-email",
        { Email: formattedEmail, Code: code },
        "post",
      )) as ApiResponse;
      applyAuthResult(res);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendLoading || countdown > 0) return;
    if (!password) {
      toast.error("Missing password. Please restart the sign-up process.");
      onBack?.();
      return;
    }
    setResendLoading(true);
    try {
      await handleAPI(
        "Auth/request-verification",
        {
          Email: formattedEmail,
          Password: password,
          FullName: fullName,
        },
        "post",
      );
      toast.success("A new verification code has been sent to your email.");
      setCountdown(RESEND_INTERVAL);
      setCode("");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full lg:mt-4 md:w-[40%] h-full flex flex-col justify-center mx-auto">
      <div className="bg-white border border-[#00000010] rounded-3xl px-7 py-8 md:px-10 md:py-10 shadow-sm">
        <h3 className="font-bold text-3xl mb-2">Verify your email</h3>
        <p className="text-[#00000080] text-base md:text-lg mb-6 leading-7">
          We sent a 6-digit verification code to{" "}
          <span className="font-semibold text-black">{formattedEmail}</span>. Enter the code below to
          complete your account setup.
        </p>
        <div className="flex flex-col gap-5 md:w-[100%] 2xl:w-[65%]">
          <input
            autoFocus
            value={code}
            maxLength={6}
            inputMode="numeric"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setCode(value.slice(0, 6));
            }}
            className="outline-none text-2xl tracking-[0.5rem] text-center px-5 py-4 rounded-xl bg-gray-100 font-semibold"
            placeholder="123456"
            pattern="[0-9]{6}"
          />
          <button
            onClick={handleVerify}
            disabled={loading}
            className={`bg-black text-white rounded-xl py-4 text-lg ${
              loading ? "cursor-wait opacity-70" : ""
            }`}
          >
            Verify &amp; Continue
          </button>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading || countdown > 0}
            className={`border border-[#88888888] text-black rounded-xl py-3 text-lg ${
              resendLoading || countdown > 0 ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            {resendLoading
              ? "Sending..."
              : countdown > 0
                ? `Resend code in ${countdown}s`
                : "Resend code"}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="text-[#00000090] underline text-lg"
          >
            Change email
          </button>
        </div>
      </div>
    </div>
  );
}
