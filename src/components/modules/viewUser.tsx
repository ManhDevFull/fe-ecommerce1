import { IAddress, IUser } from "@/types/type";
import { Modal, ModalBody, ModalHeader } from "../ui/modal";
import { useEffect, useState } from "react";
import handleAPI from "@/axios/handleAPI";

export default function ViewUser(props: {
  visible: boolean;
  user: IUser | null;
  onClose: () => void;
}) {
  const { visible, onClose, user } = props;
  const [address, setAddress] = useState<IAddress[]>([]);
  useEffect(() => {
    const getAddress = async () => {
      const res = await handleAPI("admin/Address", { id: user?.id }, "post");
      if (res.status === 200) {
        setAddress(res.data);
      }
    };
    if (visible) getAddress();
  }, [visible]);
  if (!visible) return null;
  return (
    <Modal
      open={visible}
      onClose={() => onClose?.()}
      variant="centered"
      size="md"
      showOverlay
      showCloseButton
      className="w-200"
    >
      <ModalHeader>
        <h2 className="text-lg font-semibold">User Info</h2>
      </ModalHeader>
      <ModalBody>
        {user ? (
          <div className="w-full grid grid-cols-2 gap-3">
            <div className="col-span-1 p-3 shadow-[0px_0px_4px_rgba(0,0,0,0.3)] rounded-lg">
              <p>Name: {user.name}</p>
              <p>Telephone: {user.tel}</p>
              <p>Email: {user.email}</p>
              <p>Orders: {user.orders}</p>
            </div>
            <div className="col-span-1">{
              address && address.map((adr:IAddress, index)=><div key={adr.id} className={`p-3 rounded-lg shadow-[0px_0px_4px_rgba(0,0,0,0.3)] ${index === address.length -1 ? "" : "mb-4"}`}>
               <h1>{adr.title}</h1>
              </div>)}</div>
          </div>
        ) : (
          <p>No user selected</p>
        )}
      </ModalBody>
    </Modal>
  );
}
