"use client";
import { useEffect, useState, useRef } from "react";
import handleAPI from "@/axios/handleAPI";
import { useSelector } from "react-redux";
import { authSelector, UserAuth } from "@/redux/reducers/authReducer";
import { toast } from "sonner";

interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

export default function AccountForm() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "", // Thêm email vào đây
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth: UserAuth = useSelector(authSelector);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      if (!auth.token) {
        setError("Vui lòng đăng nhập để xem thông tin.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await handleAPI("/User/profile", undefined, "get");
        console.log("API Response (đã là userProfile):", response);

        if (response) {
          const profileData = response as unknown as UserProfile;
          setProfile(profileData);

          setFormData({
            firstName: profileData.firstName || "",
            lastName: profileData.lastName || "",
            displayName: `${profileData.firstName || ""} ${
              profileData.lastName || ""
            }`.trim(),
            email: profileData.email || "", // Cập nhật state với email
          });

          setPreview(profileData.avatarUrl);
        } else {
          setError("Không nhận được dữ liệu người dùng hợp lệ từ server.");
          toast.error("Lỗi dữ liệu trả về.");
        }
      } catch (err: any) {
        console.error("Lỗi fetch profile:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Lỗi không xác định khi tải thông tin."
        );
        toast.error("Không thể tải thông tin tài khoản.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [auth.token]);

  // Đổi tên hàm thành handleInputChange (từ file của bạn)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... (logic của bạn)
  };

  const handleAvatarUpload = async () => {
    // ... (logic của bạn)
  };

  const handleSubmitInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toast.loading("Đang cập nhật thông tin...");
      const updateDto = {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        firstName: formData.firstName,
        lastName: formData.lastName,
      };
      await handleAPI("/User/profile", updateDto, "put");
      toast.dismiss();
      toast.success("Cập nhật thông tin thành công!");
    } catch (error: any) {
      toast.dismiss();
      console.error("Lỗi cập nhật profile:", error);
      toast.error(
        error.response?.data?.message || "Cập nhật thông tin thất bại."
      );
    }
  };

  const handleSubmitPassword = async (/* ... */) => {
    // ... (logic của bạn)
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">Đang tải thông tin tài khoản...</div>
    );
  }
  if (error) {
    return <div className="p-6 text-red-600 text-center">Lỗi: {error}</div>;
  }
  if (!profile) {
    return <div className="p-6 text-center">Không có thông tin tài khoản.</div>;
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <img
          src="https://res.cloudinary.com/do0im8hgv/image/upload/v1757949078/image_1_gmpnkd.png"
          alt=""
          className="w-[43px] h-[43px] mr-3"
        />
        <h2 className="text-xl font-semibold text-[25px]">Account Details</h2>
      </div>

      {/* ===============================================================
        PHẦN SỬA ĐỔI BẮT ĐẦU TỪ ĐÂY
        ===============================================================
      */}
      <form
        className="grid grid-cols-1 gap-6 w-full font-sans-serif text-[15px]"
        onSubmit={handleSubmitInfo} // <-- THÊM HÀM SUBMIT VÀO FORM
      >
        {/* First Name */}
        <div className="w-full">
          <label className="block font-medium mb-1 text-[#6C7275]">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-[#CBCBCB] rounded-md p-2"
            placeholder="Sofia"
            // --- THÊM 3 DÒNG NÀY ---
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            // --------------------
          />
        </div>

        {/* Last Name */}
        <div className="w-full">
          <label className="block font-medium mb-1 text-[#6C7275]">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-[#CBCBCB] rounded-md p-2"
            placeholder="Havertz"
            // --- THÊM 3 DÒNG NÀY ---
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            // --------------------
          />
        </div>

        {/* Display Name */}
        <div className="w-full">
          <label className="block font-medium mb-1 text-[#6C7275]">
            Display Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-[#CBCBCB] rounded-md p-2"
            placeholder="Sofia"
            // --- THÊM 3 DÒNG NÀY ---
            name="displayName"
            value={formData.displayName}
            onChange={handleInputChange}
            // --------------------
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be how your name will be displayed in the account section
            and in reviews
          </p>
        </div>

        {/* Email */}
        <div className="w-full">
          <label className="block font-medium mb-1 text-[#6C7275]">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            // --- THÊM/SỬA CÁC DÒNG NÀY ---
            className="w-full border border-[#CBCBCB] rounded-md p-2 bg-gray-100 cursor-not-allowed" // Thêm CSS để báo không sửa được
            placeholder="sofiahavertz@gmail.com"
            name="email"
            value={formData.email} // Lấy từ state
            readOnly // <-- Không cho sửa email
            // --------------------
          />
        </div>

        {/* Password */}
        {/*
          Lưu ý: Các trường password này nên được xử lý bằng một state riêng
          và một hàm handleSubmitPassword riêng.
          Tôi sẽ không bind chúng vào 'formData' chung.
        */}
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4 text-[25px]">Password</h2>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block font-medium mb-1 text-[#6C7275]">
                Old Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="oldPassword" // <-- Nên đặt name
                className="w-full border border-[#CBCBCB] rounded-md p-2"
                placeholder="Enter old password"
                // (Không truyền value cho password)
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-[#6C7275]">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="newPassword" // <-- Nên đặt name
                className="w-full border border-[#CBCBCB] rounded-md p-2"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-[#6C7275]">
                Repeat New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword" // <-- Nên đặt name
                className="w-full border border-[#CBCBCB] rounded-md p-2"
                placeholder="Repeat new password"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div>
          <button
            type="submit" // <-- Nút này sẽ trigger hàm onSubmit của form
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}