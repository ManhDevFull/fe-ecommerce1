"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
export default function FormAuth(props: {
  type: "login" | "sign-up";
  handle?: (val:{
email?: string, name?: string, pass?: string
          }) => void;
}) {
  const { type, handle } = props;
  const route = useRouter();
  const [state, setState] = useState<{
    email?: string;
    password?: string;
    fullName?: string;
  }>({});
  const authSubmit = () => {
    if (state.email && state.password) {
      route.push("/");
      toast.success("Login successful !!!");
    } else {
      toast.warning("Please enter complete information!");
    }
  };
  if (type === "login")
    return (
      <div className="w-full lg:mt-4 md:w-[40%] h-full flex flex-col justify-center mx-auto">
        <div>
          <p className="flex flex-col mt-5 md:w-[100%] 2xl:w-[65%]">
            <label className="font-bold text-2xl">Email</label>
            <input
              className="outline-none text-lg px-5 py-4 rounded-xl bg-gray-100 mt-3"
              type="email"
              placeholder="Enter your email address"
              onChange={(e) =>
                setState((ps) => ({ ...ps, email: e.target.value }))
              }
            />
          </p>
          <p className="flex flex-col mt-5 md:w-[100%] 2xl:w-[65%]">
            <label className="font-bold text-2xl">Password</label>
            <input
              className="outline-none text-lg px-5 py-4 rounded-xl bg-gray-100 mt-3"
              type="password"
              placeholder="Enter your password"
              onChange={(e) =>
                setState((ps) => ({ ...ps, password: e.target.value }))
              }
            />
          </p>
          <button
            onClick={authSubmit}
            className="bg-black text-white rounded-xl flex justify-center w-full md:w-[100%] 2xl:w-[65%] mt-6 py-4 text-lg"
          >
            Login
          </button>
        </div>
        <div className="relative md:w-[100%] 2xl:w-[65%]">
          <hr className="w-full my-7 border-t-1 border-[#8888886f]" />
          <p className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-5 text-[#0000008f]">
            Or
          </p>
        </div>
        <div>
          <button className="border border-[#88888888] text-black rounded-xl flex justify-center w-full md:w-[100%] 2xl:w-[65%] py-3 text-lg items-center">
            <FcGoogle size={43} />{" "}
            <span className="ml-3">Login with Google</span>
          </button>
          <button className="bg-[#1877F2] text-white rounded-xl flex justify-center w-full md:w-[100%] 2xl:w-[65%] mt-6 py-3 text-lg items-center">
            <FaFacebook size={43} color="white" />{" "}
            <span className="ml-3">Login with Facebook</span>
          </button>
          <p className="w-full md:w-[100%] 2xl:w-[65%] mt-5 text-center text-lg text-[#00000060]">
            First time here?{" "}
            <Link
              className="!text-black underline decoration-[#000000]"
              href={"/sign-up"}
            >
              Signup
            </Link>
          </p>
        </div>
      </div>
    );
  return (
    <div className="w-full lg:mt-4 md:w-[40%] h-full flex flex-col justify-center mx-auto">
      <div>
        <p className="flex flex-col mt-5 md:w-[100%] 2xl:w-[65%]">
          <label className="font-bold text-2xl">Full name</label>
          <input
            className="outline-none text-lg px-5 py-4 rounded-xl bg-gray-100 mt-3"
            type="text"
            placeholder="Enter your full name"
                     onChange={(e) =>
                setState((ps) => ({ ...ps, fullName: e.target.value }))
              }
          />
        </p>
        <p className="flex flex-col mt-5 md:w-[100%] 2xl:w-[65%]">
          <label className="font-bold text-2xl">Email</label>
          <input
            className="outline-none text-lg px-5 py-4 rounded-xl bg-gray-100 mt-3"
            type="email"
            placeholder="Enter your email address"
                     onChange={(e) =>
                setState((ps) => ({ ...ps, email: e.target.value }))
              }
          />
        </p>
        <p className="flex flex-col mt-5 md:w-[100%] 2xl:w-[65%]">
          <label className="font-bold text-2xl">Password</label>
          <input
            className="outline-none text-lg px-5 py-4 rounded-xl bg-gray-100 mt-3"
            type="password"
            placeholder="Enter your password"
                     onChange={(e) =>
                setState((ps) => ({ ...ps, password: e.target.value }))
              }
          />
        </p>
        <button
          onClick={()=>handle?.({email: state.email, name: state.fullName, pass: state.password})}
          className="bg-black text-white rounded-xl flex justify-center w-full md:w-[100%] 2xl:w-[65%] mt-6 py-4 text-lg"
        >
          Sign Up
        </button>
      </div>
      <div className="relative md:w-[100%] 2xl:w-[65%]">
        <hr className="w-full my-7 border-t-1 border-[#8888886f]" />
        <p className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-5 text-[#0000008f]">
          Or
        </p>
      </div>
      <div>
        <button className="border border-[#88888888] text-black rounded-xl flex justify-center w-full md:w-[100%] 2xl:w-[65%] py-3 text-lg items-center">
          <FcGoogle size={43} />{" "}
          <span className="ml-3">Sign Up with Google</span>
        </button>
        <button className="bg-[#1877F2] text-white rounded-xl flex justify-center w-full md:w-[100%] 2xl:w-[65%] mt-6 py-3 text-lg items-center">
          <FaFacebook size={43} color="white" />{" "}
          <span className="ml-3">Sign Up with Facebook</span>
        </button>
        <p className="w-full md:w-[100%] 2xl:w-[65%] mt-5 text-center text-lg text-[#00000060]">
          Already a member?{" "}
          <Link
            className="!text-black underline decoration-[#000000]"
            href={"/login"}
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
