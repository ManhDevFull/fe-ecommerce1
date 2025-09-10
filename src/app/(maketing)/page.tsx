"use client"
import handleAPI from "@/axios/handleAPI"
import { addAuth, authSelector, UserAuth } from "@/redux/reducers/authReducer"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

export default function Home() {
  const auth: UserAuth = useSelector(authSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await handleAPI("User")
      } catch (error) {
        console.error("Error:", error)
      }
    }
    getUser()
  }, [])

  return <p>Trang chủ</p>
}
