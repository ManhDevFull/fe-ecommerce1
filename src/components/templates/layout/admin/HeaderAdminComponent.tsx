import handleAPI from "@/axios/handleAPI";
import {
  addAuth,
  authSelector,
  removeAuth,
  UserAuth,
} from "@/redux/reducers/authReducer";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BiMessageRoundedDots } from "react-icons/bi";
import { DiGnu } from "react-icons/di";
import { IoMdNotificationsOutline } from "react-icons/io";
import { TbLogout } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function HeaderAdminComponent() {
  const dispatch = useDispatch();
  const route = useRouter();
  const auth: UserAuth = useSelector(authSelector);
  const [userInfo, setUserInfo] = useState<UserAuth>(auth);
  const [chatOpen, setChatOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const chatButtonRef = useRef<HTMLButtonElement | null>(null);
  const notifButtonRef = useRef<HTMLButtonElement | null>(null);
  const chatPanelRef = useRef<HTMLDivElement | null>(null);
  const notifPanelRef = useRef<HTMLDivElement | null>(null);

  const chatThreads = useMemo(
    () => [
      {
        id: 1,
        sender: "Support Bot",
        snippet: "Need any help with order #1234?",
        time: "Just now",
      },
      {
        id: 2,
        sender: "Alex (Warehouse)",
        snippet: "Inventory count finished for AirPods Max.",
        time: "1h ago",
      },
      {
        id: 3,
        sender: "Linh - CS",
        snippet: "Customer asked for shipping ETA update.",
        time: "Yesterday",
      },
    ],
    []
  );

  const notifications = useMemo(
    () => [
      {
        id: 1,
        title: "Low stock alert",
        description: "MacBook Pro 14” has dropped below 5 units.",
        time: "5m ago",
      },
      {
        id: 2,
        title: "New review submitted",
        description: "Customer rated AirPods Pro with 5 stars.",
        time: "22m ago",
      },
      {
        id: 3,
        title: "Order #9241 paid",
        description: "COD payment confirmed and marked delivered.",
        time: "2h ago",
      },
      {
        id: 4,
        title: "Variant updated",
        description: "iPhone 15 / Blue / 256GB price changed to 1,129$.",
        time: "Yesterday",
      },
    ],
    []
  );

  useEffect(() => {
    const getData = async () => {
      const res = localStorage.getItem("token");
      res && dispatch(addAuth(JSON.parse(res)));
      res && setUserInfo(JSON.parse(res));
    };
    getData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        chatOpen &&
        chatPanelRef.current &&
        !chatPanelRef.current.contains(target) &&
        !chatButtonRef.current?.contains(target)
      ) {
        setChatOpen(false);
      }
      if (
        notificationOpen &&
        notifPanelRef.current &&
        !notifPanelRef.current.contains(target) &&
        !notifButtonRef.current?.contains(target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [chatOpen, notificationOpen]);

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
        <div className="flex items-center ml-15 gap-4">
          <div className="relative">
            <button
              ref={chatButtonRef}
              className="shadow-[0px_4px_4px_rgba(0,0,0,0.35)] w-10 flex items-center justify-center rounded-lg h-10 bg-[#F7F7F7]"
              onClick={() => {
                setChatOpen((prev) => !prev);
                setNotificationOpen(false);
              }}
              aria-label="Open chat inbox"
            >
              <BiMessageRoundedDots size={25} />
              <p className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 shadow-[0px_2px_4px_rgba(0,0,0,0.25)] rounded-full bg-[#FF7F7F] px-1.5 h-[18px] flex items-center justify-center text-white text-[12px] z-1">
                {chatThreads.length}
              </p>
            </button>
            {chatOpen && (
              <div
                ref={chatPanelRef}
                className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-[#e5e7eb] bg-white p-5 shadow-[0px_16px_48px_rgba(15,23,42,0.18)]"
              >
                <span
                  className="absolute -top-[0.43rem] h-3 w-3 rotate-45 border-t border-l border-[#e5e7eb] bg-white"
                  style={{ right: "0.8rem" }}
                  aria-hidden="true"
                />
                <div className="mb-3 flex flex-col gap-1">
                  <h2 className="text-sm font-semibold text-[#1f2937]">Recent conversations</h2>
                  <p className="text-xs text-gray-500">
                    Quick replies to your latest support and team messages.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {chatThreads.map((thread) => (
                    <button
                      key={thread.id}
                      className="flex w-full flex-col rounded-lg border border-[#ececec] bg-[#f9fafb] px-3 py-2 text-left transition hover:border-[#cbd5f5] hover:bg-white"
                      onClick={() => setChatOpen(false)}
                    >
                      <div className="flex items-center justify-between text-sm font-medium text-[#1f2937]">
                        <span>{thread.sender}</span>
                        <span className="text-xs font-normal text-gray-500">{thread.time}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-600 line-clamp-2">{thread.snippet}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              ref={notifButtonRef}
              className="shadow-[0px_4px_4px_rgba(0,0,0,0.35)] w-10 flex items-center justify-center rounded-lg h-10 bg-[#F7F7F7]"
              onClick={() => {
                setNotificationOpen((prev) => !prev);
                setChatOpen(false);
              }}
              aria-label="Open notifications"
            >
              <IoMdNotificationsOutline size={25} />
              <p className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 shadow-[0px_2px_4px_rgba(0,0,0,0.25)] rounded-full bg-[#FF7F7F] px-1.5 h-[18px] flex items-center justify-center text-white text-[12px]">
                {notifications.length > 99 ? "99+" : notifications.length}
              </p>
            </button>
            {notificationOpen && (
              <div
                ref={notifPanelRef}
                className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-[#e5e7eb] bg-white p-5 shadow-[0px_16px_48px_rgba(15,23,42,0.18)]"
              >
                <span
            className="absolute -top-[0.43rem] h-3 w-3 rotate-45 border-t border-l border-[#e5e7eb] bg-white"
                  style={{ right: "0.8rem" }}
                  aria-hidden="true"
                />
                <div className="mb-3 flex flex-col gap-1">
                  <h2 className="text-sm font-semibold text-[#1f2937]">Notifications</h2>
                  <p className="text-xs text-gray-500">
                    Stay on top of orders, inventory changes, and customer activity.
                  </p>
                </div>
                <div className="flex max-h-72 flex-col gap-2 overflow-y-auto pr-1">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-[#ececec] bg-[#f9fafb] px-3 py-2 text-sm text-[#1f2937] shadow-sm"
                    >
                      <div className="flex items-center justify-between font-medium">
                        <span>{item.title}</span>
                        <span className="text-xs font-normal text-gray-500">{item.time}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center ml-8">
          <button className="shadow-[0px_4px_4px_rgba(0,0,0,0.35)] px-8 rounded-lg h-10 bg-[#FBF0F0] text-[#474747] ">
            Hello, {userInfo.name}
          </button>
          <button
            onClick={logout}
            className="shadow-[0px_4px_4px_rgba(0,0,0,0.35)] text-[#474747] ml-4 px-5 rounded-lg h-10 bg-[#F7F7F7] flex items-center"
          >
            <TbLogout size={25} />
            <p className="pl-2">Log out</p>
          </button>
        </div>
      </div>
    </header>
  );
}
