"use client";
import { useEffect, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { Modal, ModalBody } from "@/components/ui/modal";
import { toast } from "sonner";
import handleAPI from "@/axios/handleAPI";
import axios from "axios";

// --- Interfaces ---
interface Province { code: number; name: string; }
interface District { code: number; name: string; province_code: number; }
interface Ward { code: number; name: string; district_code: number; }
interface Address {
  id: number;
  title: string;
  nameRecipient: string;
  tel: string;
  codeWard: number;
  detail: string;
  description?: string;
  fullAddress?: string;
}

export default function AddressForm() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "Home",
    nameRecipient: "",
    tel: "",
    detail: "",
    description: "",
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | string>("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | string>("");
  const [selectedWardCode, setSelectedWardCode] = useState<number | string>("");

  // --- Load địa chỉ ---
  const fetchAddresses = async () => {
    try {
      const res: any = await handleAPI("api/Address/my-addresses", undefined, "get");
      const normalized = (Array.isArray(res) ? res : []).map((item: any) => ({
        id: item.id ?? item.Id ?? 0,
        title: item.title ?? item.Title ?? "",
        nameRecipient: item.nameRecipient ?? item.NameRecipient ?? "",
        tel: item.tel ?? item.Tel ?? "",
        codeWard: item.codeWard ?? item.CodeWard ?? 0,
        detail: item.detail ?? item.Detail ?? "",
        description: item.description ?? item.Description ?? "",
        fullAddress: item.fullAddress ?? item.FullAddress,
      }));
      setAddresses(normalized);
    } catch (err) {
      console.error("Lỗi tải địa chỉ:", err);
      toast.error("Không tải được danh sách địa chỉ");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // --- Load Provinces ---
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await axios.get("https://provinces.open-api.vn/api/?depth=1");
        setProvinces(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Không tải được Tỉnh/Thành");
      }
    };
    if (open) fetchProvinces();
  }, [open]);

  // --- Load Districts ---
  useEffect(() => {
    if (!selectedProvinceCode) return setDistricts([]);
    const fetchDistricts = async () => {
      try {
        const res = await axios.get(`https://provinces.open-api.vn/api/p/${selectedProvinceCode}?depth=2`);
        setDistricts(res.data.districts);
        setWards([]);
        setSelectedDistrictCode("");
        setSelectedWardCode("");
      } catch (err) { console.error(err); }
    };
    fetchDistricts();
  }, [selectedProvinceCode]);

  // --- Load Wards ---
  useEffect(() => {
    if (!selectedDistrictCode) return setWards([]);
    const fetchWards = async () => {
      try {
        const res = await axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrictCode}?depth=2`);
        setWards(res.data.wards);
        setSelectedWardCode("");
      } catch (err) { console.error(err); }
    };
    fetchWards();
  }, [selectedDistrictCode]);

  // --- Edit address ---
  const handleEdit = (item: Address) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      nameRecipient: item.nameRecipient,
      tel: item.tel,
      detail: item.detail,
      description: item.description || "",
    });
    setSelectedWardCode(item.codeWard);
    setOpen(true);
  };

  // --- Delete address ---
  const handleDelete = async (id: number) => {
    if (!confirm("Xóa địa chỉ này?")) return;
    try {
      await handleAPI(`api/Address/${id}`, undefined, "delete");
      toast.success("Xóa thành công");
      fetchAddresses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi xóa");
    }
  };

  // --- Save address ---
  const handleSaveAddress = async () => {
    if (!formData.title || !formData.nameRecipient || !formData.tel || !formData.detail || !selectedWardCode) {
      toast.error("Vui lòng điền đầy đủ thông tin và chọn Phường/Xã");
      return;
    }

    const payload = {
      Title: formData.title,
      NameRecipient: formData.nameRecipient,
      Tel: formData.tel,
      CodeWard: Number(selectedWardCode),
      Detail: formData.detail,
      Description: formData.description || "",
    };

    setIsLoading(true);
    try {
      if (editingId !== null) {
        await handleAPI(`api/Address/${editingId}`, payload, "put");
        toast.success("Cập nhật địa chỉ thành công");
      } else {
        await handleAPI("api/Address", payload, "post");
        toast.success("Thêm địa chỉ mới thành công");
      }
      setOpen(false);
      fetchAddresses();
      setEditingId(null);
      setFormData({ title: "Home", nameRecipient: "", tel: "", detail: "", description: "" });
      setSelectedProvinceCode("");
      setSelectedDistrictCode("");
      setSelectedWardCode("");
    } catch (err: any) {
      console.error("Lỗi lưu địa chỉ:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Lỗi khi lưu địa chỉ");
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: "Home", nameRecipient: "", tel: "", detail: "", description: "" });
    setSelectedProvinceCode("");
    setSelectedDistrictCode("");
    setSelectedWardCode("");
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <h2 className="text-xl font-semibold text-[25px]">Address Book</h2>
        <button onClick={openAddModal} className="ml-auto text-black hover:text-blue-600">
          <IoAddCircleOutline className="w-8 h-8"/>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="text-gray-500 hover:text-blue-600"><CiEdit/></button>
                <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-red-600"><MdDeleteOutline/></button>
              </div>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-medium">{item.nameRecipient}</p>
              <p>{item.tel}</p>
              <p>{item.detail}</p>
              {item.description && <p className="italic text-xs">Note: {item.description}</p>}
            </div>
          </div>
        ))}
        {addresses.length === 0 && <div className="col-span-full text-center py-8 text-gray-500">Chưa có địa chỉ nào.</div>}
      </div>

      {open && (
        <Modal open={open} onClose={() => setOpen(false)} variant="centered" size="lg" showOverlay showCloseButton>
          <ModalBody>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-semibold mb-4">{editingId !== null ? "Edit Address" : "Add New Address"}</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Address Label</label>
                    <select value={formData.title} onChange={e => setFormData({...formData, title:e.target.value})} className="w-full border rounded-md p-2">
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label>Recipient Name</label>
                    <input type="text" value={formData.nameRecipient} onChange={e => setFormData({...formData, nameRecipient:e.target.value})} className="w-full border rounded-md p-2"/>
                  </div>
                </div>
                <div>
                  <label>Phone</label>
                  <input type="text" value={formData.tel} onChange={e => setFormData({...formData, tel:e.target.value})} className="w-full border rounded-md p-2"/>
                </div>

                {/* Dropdown Tỉnh/Huyện/Xã */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-3 rounded-md border">
                  <div>
                    <label>Province</label>
                    <select value={selectedProvinceCode} onChange={e=>setSelectedProvinceCode(e.target.value)} className="w-full border rounded-md p-2 text-sm">
                      <option value="">Select Province</option>
                      {provinces.map(p=><option key={p.code} value={p.code}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label>District</label>
                    <select value={selectedDistrictCode} onChange={e=>setSelectedDistrictCode(e.target.value)} className="w-full border rounded-md p-2 text-sm" disabled={!selectedProvinceCode}>
                      <option value="">Select District</option>
                      {districts.map(d=><option key={d.code} value={d.code}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label>Ward</label>
                    <select value={selectedWardCode} onChange={e=>setSelectedWardCode(e.target.value)} className="w-full border rounded-md p-2 text-sm" disabled={!selectedDistrictCode}>
                      <option value="">Select Ward</option>
                      {wards.map(w=><option key={w.code} value={w.code}>{w.name}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label>Street / Detail</label>
                  <input type="text" value={formData.detail} onChange={e=>setFormData({...formData, detail:e.target.value})} className="w-full border rounded-md p-2"/>
                </div>

                <div>
                  <label>Note (Optional)</label>
                  <textarea value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} rows={2} className="w-full border rounded-md p-2"/>
                </div>
              </form>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={()=>setOpen(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300" disabled={isLoading}>Cancel</button>
                <button onClick={handleSaveAddress} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Address"}
                </button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}
