"use client";
import { useEffect, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { Modal, ModalBody } from "@/components/ui/modal";
import { toast } from "sonner";
import handleAPI from "@/axios/handleAPI";
import axios from "axios"; // Dùng axios trực tiếp để gọi API địa chính bên ngoài

// --- Interface cho Địa chính (Provinces API) ---
interface Province {
  code: number;
  name: string;
}
interface District {
  code: number;
  name: string;
  province_code: number;
}
interface Ward {
  code: number;
  name: string;
  district_code: number;
}

// --- Interface cho Địa chỉ (Backend) ---
interface Address {
  id: number;
  title: string; // "Billing Address", "Shipping Address", ...
  nameRecipient: string;
  tel: string;
  codeWard: number;
  detail: string;
  description?: string;
  fullAddress?: string; // Backend có thể trả về hoặc FE tự ghép
}

export default function AddressForm() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);

  // State cho Form
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "Home",
    nameRecipient: "",
    tel: "",
    detail: "",
    description: "",
  });

  // State cho Dropdown Địa chính
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | string>("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | string>("");
  const [selectedWardCode, setSelectedWardCode] = useState<number | string>(""); // Đây là CodeWard sẽ lưu DB

  // 1. Load danh sách địa chỉ từ Backend
  const fetchAddresses = async () => {
    try {
      const res: any = await handleAPI("/api/Address/my-addresses", undefined, "get");
      console.log("Địa chỉ tải về:", res);
      setAddresses(res);
    } catch (error) {
      console.error("Lỗi tải địa chỉ:", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // 2. Load danh sách Tỉnh/Thành (Chạy 1 lần)
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        // Gọi API public để lấy Tỉnh/Thành (depth=1)
        const res = await axios.get("https://provinces.open-api.vn/api/?depth=1");
        setProvinces(res.data);
      } catch (error) {
        console.error("Lỗi tải Tỉnh/Thành:", error);
        toast.error("Không thể tải danh sách Tỉnh/Thành");
      }
    };
    if (open) {
      fetchProvinces();
    }
  }, [open]);

  // 3. Khi chọn Tỉnh -> Load Huyện
  useEffect(() => {
    if (selectedProvinceCode) {
      const fetchDistricts = async () => {
        try {
          const res = await axios.get(`https://provinces.open-api.vn/api/p/${selectedProvinceCode}?depth=2`);
          setDistricts(res.data.districts);
          setWards([]); // Reset xã
          setSelectedDistrictCode(""); // Reset huyện đã chọn
          setSelectedWardCode(""); // Reset xã đã chọn
        } catch (error) {
          console.error("Lỗi tải Quận/Huyện:", error);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [selectedProvinceCode]);

  // 4. Khi chọn Huyện -> Load Xã
  useEffect(() => {
    if (selectedDistrictCode) {
      const fetchWards = async () => {
        try {
          const res = await axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrictCode}?depth=2`);
          setWards(res.data.wards);
          setSelectedWardCode(""); // Reset xã đã chọn
        } catch (error) {
          console.error("Lỗi tải Phường/Xã:", error);
        }
      };
      fetchWards();
    } else {
      setWards([]);
    }
  }, [selectedDistrictCode]);

  // --- Hàm lấy tên đầy đủ từ mã (Để hiển thị trong danh sách nếu Backend chưa trả về fullAddress) ---
  // Lưu ý: Hàm này chỉ chạy được nếu chúng ta có data tỉnh thành. 
  // Nếu muốn hiển thị đẹp ngay lúc load list, tốt nhất Backend nên trả về chuỗi FullAddress.
  // Tạm thời hiển thị detail + mã.

  const handleEdit = async (item: Address) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      nameRecipient: item.nameRecipient,
      tel: item.tel,
      detail: item.detail,
      description: item.description || "",
    });
    
    // Lưu ý: Việc fill lại dropdown từ CodeWard cũ hơi phức tạp (cần tra ngược API).
    // Để đơn giản cho demo này, khi edit chúng ta sẽ yêu cầu chọn lại địa chỉ hành chính
    // Hoặc bạn có thể chỉ cho sửa tên/sđt/detail mà giữ nguyên CodeWard cũ nếu không chọn lại.
    
    // Tạm thời set WardCode cũ
    setSelectedWardCode(item.codeWard); 
    // (Cần logic phức tạp hơn để pre-fill Tỉnh/Huyện từ WardCode, tạm bỏ qua để code chạy trước)
    
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;
    try {
      await handleAPI(`/Address/${id}`, undefined, "delete");
      toast.success("Xóa địa chỉ thành công");
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa");
    }
  };

  const handleSaveAddress = async () => {
    // Validate
    if (!formData.title || !formData.nameRecipient || !formData.tel || !formData.detail || !selectedWardCode) {
      toast.error("Vui lòng điền đầy đủ thông tin và chọn địa chỉ Phường/Xã");
      return;
    }

    const payload = {
      ...formData,
      codeWard: Number(selectedWardCode),
    };

    setIsLoading(true);
    try {
      if (editingId) {
        // Update
        await handleAPI(`/Address/${editingId}`, payload, "put");
        toast.success("Cập nhật địa chỉ thành công");
      } else {
        // Create
        await handleAPI("/Address", payload, "post");
        toast.success("Thêm địa chỉ mới thành công");
      }
      setOpen(false);
      fetchAddresses();
      // Reset form
      setFormData({ title: "Home", nameRecipient: "", tel: "", detail: "", description: "" });
      setEditingId(null);
      setSelectedProvinceCode("");
      setSelectedDistrictCode("");
      setSelectedWardCode("");
    } catch (error: any) {
      console.error("Lỗi lưu địa chỉ:", error);
      toast.error(error.response?.data?.message || "Lỗi khi lưu địa chỉ");
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
      {/* Header */}
      <div className="flex items-center mb-6">
        <img
          src="https://res.cloudinary.com/do0im8hgv/image/upload/v1757949103/image_3_f2tien.png"
          alt=""
          className="w-[43px] h-[43px] mr-3"
        />
        <h2 className="text-xl font-semibold text-[25px]">Address Book</h2>
        <button
          onClick={openAddModal}
          className="ml-auto text-black hover:text-[#29c9d7] transition-colors duration-300"
        >
          <IoAddCircleOutline className="w-[35px] h-[35px]" />
        </button>
      </div>

      {/* Address List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((item) => (
          <div
            key={item.id}
            className="relative border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
          >
            {/* Header Card */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <CiEdit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <MdDeleteOutline className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body Card */}
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-medium">{item.nameRecipient}</p>
              <p>{item.tel}</p>
              <p className="text-gray-500">{item.detail}</p>
              {/* Hiển thị tạm mã phường xã nếu BE chưa trả full address, 
                  hoặc bạn có thể gọi API dịch ngược ở đây nếu muốn đẹp */}
              <p className="text-xs text-gray-400">
                 {/* Nếu BE trả về fullAddress thì hiển thị, không thì hiện detail */}
                 {/* {item.fullAddress || `(Phường/Xã Code: ${item.codeWard})`} */}
                 {/* Bạn có thể implement logic dịch ngược code -> text ở đây sau */}
              </p> 
              {item.description && <p className="italic text-xs">Note: {item.description}</p>}
            </div>
          </div>
        ))}
        
        {addresses.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
                Chưa có địa chỉ nào. Hãy thêm mới!
            </div>
        )}
      </div>

      {/* Modal Add/Edit */}
      {open && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          variant="centered"
          size="lg" // Modal to hơn xíu
          showOverlay
          showCloseButton={true}
        >
          <ModalBody>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-semibold mb-4">
                {editingId ? "Edit Address" : "Add New Address"}
              </h2>

              <form className="space-y-4">
                {/* Title & Recipient */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Address Label</label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        >
                            <option value="Home">Home</option>
                            <option value="Office">Office</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                         <label className="block text-sm font-medium mb-1">Recipient Name</label>
                         <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder="e.g. Sofia Havertz"
                            value={formData.nameRecipient}
                            onChange={(e) => setFormData({ ...formData, nameRecipient: e.target.value })}
                         />
                    </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="(+1) 234 567 890"
                    value={formData.tel}
                    onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                  />
                </div>

                {/* --- ĐỊA CHỈ HÀNH CHÍNH (3 Dropdown) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-3 rounded-md border border-gray-200">
                    {/* Tỉnh / Thành */}
                    <div>
                        <label className="block text-xs font-bold mb-1 text-gray-600">Province / City</label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2 text-sm"
                            value={selectedProvinceCode}
                            onChange={(e) => setSelectedProvinceCode(e.target.value)}
                        >
                            <option value="">Select Province</option>
                            {provinces.map((p) => (
                                <option key={p.code} value={p.code}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Quận / Huyện */}
                    <div>
                        <label className="block text-xs font-bold mb-1 text-gray-600">District</label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2 text-sm"
                            value={selectedDistrictCode}
                            onChange={(e) => setSelectedDistrictCode(e.target.value)}
                            disabled={!selectedProvinceCode}
                        >
                            <option value="">Select District</option>
                            {districts.map((d) => (
                                <option key={d.code} value={d.code}>{d.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Phường / Xã */}
                    <div>
                        <label className="block text-xs font-bold mb-1 text-gray-600">Ward</label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2 text-sm"
                            value={selectedWardCode}
                            onChange={(e) => setSelectedWardCode(e.target.value)}
                            disabled={!selectedDistrictCode}
                        >
                            <option value="">Select Ward</option>
                            {wards.map((w) => (
                                <option key={w.code} value={w.code}>{w.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Detail Address */}
                <div>
                  <label className="block text-sm font-medium mb-1">Street Address / Detail</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="e.g. 345 Long Island, Apt 4B"
                    value={formData.detail}
                    onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                  />
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1">Note (Optional)</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-2"
                    rows={2}
                    placeholder="e.g. Near the central park"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>

              </form>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAddress}
                  disabled={isLoading}
                  className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
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