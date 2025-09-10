
"use client"
import handleAPI from "@/axios/handleAPI"
import { useEffect } from "react"

export default function Home() {

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await handleAPI("User")
        console.log(res)
      } catch (error) {
        console.error("Error:", error)
      }
    }
    getUser()
  }, [])
  return <p>Trang chủ</p>
}
