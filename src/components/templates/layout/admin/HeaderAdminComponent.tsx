import handleAPI from "@/axios/handleAPI";
import {
  addAuth,
  authSelector,
  removeAuth,
  UserAuth,
} from "@/redux/reducers/authReducer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiMessageRoundedDots } from "react-icons/bi";
import { DiComposer, DiGnu } from "react-icons/di";
import { IoIosSearch, IoMdNotificationsOutline } from "react-icons/io";
import { TbLogout } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function HeaderAdminComponent() {
  const dispatch = useDispatch();
  const route = useRouter();
  const auth: UserAuth = useSelector(authSelector);
  const [userInfo, setUserInfo] = useState<UserAuth>(auth);
  useEffect(() => {
    const getData = async () => {
      console.log(userInfo);
      const res = localStorage.getItem("token");
      res && dispatch(addAuth(JSON.parse(res)));
      res && setUserInfo(JSON.parse(res));
    };
    getData();
  }, []);
  const logout = async () => {
    try {
      const res: any = await handleAPI("Auth/logout", {}, "post");
      if (res.status === 200) {
        toast.success(res.message);
        dispatch(removeAuth());
      }
      route.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <header className="w-full shadow h-[70px] flex px-15 items-center justify-between">
      <div className="h-full flex items-center">
        <DiGnu
          size={80}
          className="drop-shadow-[0.5px_0.5px_2px_rgba(0,0,0,1)]"
        />
        <h1 className="lakki-reddy-regular h-5 text-center text-4xl drop-shadow-[1px_0.5px_2px_rgba(0,0,0,33)]">
          Vertex ADMIN
        </h1>
      </div>
      <div className="flex items-center pr-20">
        <div className="flex items-center ml-15">
          <button className="relative shadow-[0px_4px_4px_rgba(0,0,0,0.35)] w-10 flex items-center justify-center rounded-lg h-10 bg-[#F7F7F7] ">
            <BiMessageRoundedDots size={25} />
            <p className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 shadow-[0px_2px_4px_rgba(0,0,0,0.25)] rounded-full bg-[#FF7F7F] px-1.5 h-[18px] flex items-center justify-center text-white text-[12px] z-1">
              1
            </p>
          </button>
          <button className="relative ml-4 shadow-[0px_4px_4px_rgba(0,0,0,0.35)] w-10 flex items-center justify-center rounded-lg h-10 bg-[#F7F7F7] ">
            <IoMdNotificationsOutline size={25} />
            <p className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 shadow-[0px_2px_4px_rgba(0,0,0,0.25)] rounded-full bg-[#FF7F7F] px-1.5 h-[18px] flex items-center justify-center text-white text-[12px]">
              99+
            </p>
          </button>
        </div>
        <div className="flex items-center ml-8">
          <button className="shadow-[0px_4px_4px_rgba(0,0,0,0.35)] px-8 rounded-lg h-10 bg-[#FBF0F0] text-[#474747] ">
            Hello, {userInfo.name}
          </button>
          <button className="shadow-[0px_4px_4px_rgba(0,0,0,0.35)] text-[#474747] ml-4 px-5 rounded-lg h-10 bg-[#F7F7F7] flex items-center">
            <TbLogout size={25} />
            <p className="pl-2">Log out</p>
          </button>
        </div>
      </div>
    </header>
  );
}
