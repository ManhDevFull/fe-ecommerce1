import store from "@/redux/store";
import Routers from "@/routers/Routers";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { Provider } from 'react-redux'
import Layout from "./LayOut";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <div className="h-11 bg-black flex justify-around">
        <p className="text-white h-full flex items-center">
          Welcome Suprava Saha !
        </p>
        <p className="h-full flex items-center">
          <Link href={"/order"} className="border-r text-white w-44 flex justify-center">Track your order</Link>
          <Link href={"/offers"} className="text-white w-32 flex justify-center">All Offers</Link>
        </p>
      </div>
      <Layout>
       <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}
