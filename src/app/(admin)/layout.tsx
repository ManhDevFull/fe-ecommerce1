"use client";
import "../globals.css";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { Toaster } from "sonner";
import HeaderAdminComponent from "@/components/templates/layout/admin/HeaderAdminComponent";
import SiderAdminComponent from "@/components/templates/layout/admin/SiderAdminComponent";
import RevenueComponent from "@/components/templates/layout/admin/RevenueComponent";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lakki+Reddy&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Provider store={store}>
          <Toaster
            richColors
            position="top-right"
            toastOptions={{ className: "!text-base !pl-7 !py-5 !shadow-xl" }}
          />

          <HeaderAdminComponent />
          <div className="grid grid-cols-24">
            <SiderAdminComponent className="col-span-5" />
            <div className="col-span-19 h-[calc(100vh-70px)] grid grid-cols-19">
              <div className="col-span-14 p-4 h-full">{children}</div>
              <RevenueComponent className="col-span-5" />
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
