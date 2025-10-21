import { BiMessageRoundedDots } from "react-icons/bi";
import { DiComposer, DiGnu } from "react-icons/di";
import {
  IoIosSearch,
  IoMdNotificationsOutline,
} from "react-icons/io";
import { TbLogout } from "react-icons/tb";

export default function HeaderAdminComponent() {
  const name = "Thành Mạnh";
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
        <div className="flex items-center max-w-[550px] h-10 shadow-[0px_4px_4px_rgba(0,0,0,0.35)] rounded-lg overflow-hidden bg-[#F3F3F3]">
          <IoIosSearch color="#7B7B7B" className="mx-3" size={25} />
          <input
            placeholder="Search ..."
            type="text"
            className="placeholder:text-4xl text-[#474747] w-120 h-full bg-transparent outline-none"
          />
        </div>
        <div className="flex items-center ml-15">
          <button className="relative shadow-[0px_4px_4px_rgba(0,0,0,0.35)] w-10 flex items-center justify-center rounded-lg h-10 bg-[#F7F7F7] ">
            <BiMessageRoundedDots size={25} />
            <p className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 shadow-[0px_2px_4px_rgba(0,0,0,0.25)] rounded-full bg-[#FF7F7F] px-1.5 h-[18px] flex items-center justify-center text-white text-[12px] z-1">1</p>
          </button>
          <button className="relative ml-4 shadow-[0px_4px_4px_rgba(0,0,0,0.35)] w-10 flex items-center justify-center rounded-lg h-10 bg-[#F7F7F7] ">
            <IoMdNotificationsOutline size={25} />
            <p className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 shadow-[0px_2px_4px_rgba(0,0,0,0.25)] rounded-full bg-[#FF7F7F] px-1.5 h-[18px] flex items-center justify-center text-white text-[12px]">99+</p>
          </button>
        </div>
        <div className="flex items-center ml-8">
          <button className="shadow-[0px_4px_4px_rgba(0,0,0,0.35)] px-8 rounded-lg h-10 bg-[#FBF0F0] text-[#474747] ">
            Hello, {name}
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