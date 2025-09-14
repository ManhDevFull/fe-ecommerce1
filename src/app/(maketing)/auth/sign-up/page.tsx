"use client";
import FormAuth from "@/components/templates/AuthForm/FormAuth";
import FormOTP from "@/components/templates/AuthForm/FormOTP";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function SignUpPage() {
  const [state, setState] = useState<{
    loading: boolean;
    fullName?: string;
    email?: string;
    password?: string;
    pageOTP: boolean;
  }>({
    loading: false,
    pageOTP: false,
    // email: "thanhmanhdangfa@gmail.com",
  });
  return (
    <main className="relative px-10 sm:px-10 md:px-8 pt-7 w-full flex overflow-hidden">
      <svg
        className="absolute z-[-1] -bottom-[90%] -left-[50%] w-[140%] h-[200%]"
        width="2402"
        height="2434"
        viewBox="0 0 2402 2434"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M809.119 1857.25C684.78 1775.74 707.233 1589.47 648.864 1452.73C591.834 1319.13 436.894 1207.44 471.512 1066.36C506.217 924.929 701.307 903.888 807.889 804.65C917.385 702.701 959.086 525.74 1101.47 479.817C1251.81 431.328 1435.87 460.933 1556.18 563.311C1672.14 661.998 1635.93 846.582 1696.58 986.255C1756.33 1123.86 1921.6 1222.2 1907.12 1371.51C1892.53 1522.02 1749.24 1625.61 1626.09 1713.36C1513.98 1793.23 1380.36 1819.52 1244.79 1843.4C1098.11 1869.24 933.681 1938.91 809.119 1857.25Z"
          stroke="black"
          strokeOpacity="0.1"
          strokeWidth="4.25168"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M849.365 1791.42C737.812 1718.29 757.957 1551.17 705.589 1428.49C654.424 1308.63 515.416 1208.42 546.474 1081.85C577.61 954.963 752.639 936.085 848.262 847.052C946.498 755.586 983.911 596.822 1111.66 555.621C1246.54 512.119 1411.67 538.679 1519.6 630.53C1623.64 719.069 1591.15 884.672 1645.57 1009.98C1699.17 1133.44 1847.45 1221.66 1834.46 1355.62C1821.37 1490.65 1692.82 1583.6 1582.33 1662.32C1481.74 1733.98 1361.87 1757.57 1240.24 1778.99C1108.64 1802.17 961.118 1864.68 849.365 1791.42Z"
          stroke="black"
          strokeOpacity="0.1"
          strokeWidth="4.25168"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M769.503 1922.06C632.579 1832.29 657.305 1627.17 593.027 1476.59C530.225 1329.46 359.602 1206.47 397.724 1051.12C435.942 895.367 650.778 872.195 768.149 762.913C888.728 650.645 934.65 455.772 1091.45 405.201C1257.01 351.804 1459.7 384.406 1592.18 497.146C1719.88 605.822 1680 809.089 1746.79 962.9C1812.59 1114.43 1994.58 1222.72 1978.64 1387.15C1962.58 1552.89 1804.79 1666.97 1669.17 1763.6C1545.71 1851.56 1398.57 1880.51 1249.27 1906.8C1087.74 1935.26 906.673 2011.98 769.503 1922.06Z"
          stroke="black"
          strokeOpacity="0.1"
          strokeWidth="4.25168"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M727.315 1991.07C576.987 1892.52 604.134 1667.32 533.564 1502C464.614 1340.47 277.29 1205.44 319.143 1034.88C361.102 863.883 596.968 838.443 725.828 718.464C858.21 595.205 908.627 381.257 1080.77 325.736C1262.54 267.113 1485.07 302.905 1630.52 426.681C1770.72 545.995 1726.94 769.16 1800.26 938.026C1872.5 1104.39 2072.32 1223.28 2054.81 1403.81C2037.18 1585.77 1863.94 1711.02 1715.05 1817.1C1579.5 1913.67 1417.96 1945.46 1254.05 1974.33C1076.71 2005.56 877.911 2089.8 727.315 1991.07Z"
          stroke="black"
          strokeOpacity="0.1"
          strokeWidth="4.25168"
        />
      </svg>

      <div className="hidden md:flex w-[60%] flex-col items-center justify-between pb-20 xl:pb-0 overflow-hidden">
        <div className="w-full px-10 whitespace-nowrap xl:px-35">
          <h3 className="font-bold text-4xl xl:text-5xl">Create an account</h3>
          <p className="text-[#00000060] text-lg">Login in to your account</p>
        </div>
        {state.pageOTP ? (
          <Image
            className="w-[100%] xl:w-[90%] 2xl:w-[80%] lg:mb-5 xl:mb-10 2xl:mb-0"
            src="https://res.cloudinary.com/do0im8hgv/image/upload/v1755839130/6736e108-8132-4433-9182-33a099b345b2.png"
            alt="image-auth"
          />
        ) : (
          <Image
            className="w-[90%] xl:w-[80%] 2xl:w-[70%]"
            src="https://res.cloudinary.com/do0im8hgv/image/upload/v1755761340/370e0dbb-f34c-4ba7-8e5c-797f036749ee.png"
            alt="image-auth"
          />
        )}
      </div>
      {state.pageOTP && state.email ? (
        <FormOTP />
      ) : (
        <FormAuth
          type="sign-up"
          handle={(val: { email?: string; name?: string; pass?: string }) => {
            if (val.email) {
              setState((ps) => ({ ...ps, pageOTP: true, email: val.email, fullName: val.name, password: val.pass }));
            } else {
              toast.warning("Please enter complete information!");
            }
          }}
        />
      )}
    </main>
  );
}
