import { authSelector, AuthState } from "@/redux/reducers/authReducer";
import { Layout } from "antd";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


export default function Routers() {
  const [isLoading, setIsLoading] = useState(false)
  const auth: AuthState = useSelector(authSelector)
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth.token && pathname !== "/login") {
      router.replace('/login')
    }
    getData()
  }, [])
  const getData = async () => {
    console.log(auth)
  }
  return <>
    
  </>
}