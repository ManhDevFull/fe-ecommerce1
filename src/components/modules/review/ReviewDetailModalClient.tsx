import { useState } from "react";
import { toast } from "sonner";
import handleAPI from "@/axios/handleAPI"; // Hàm gọi API của bạn
import { FaStar, FaCamera, FaTimes } from "react-icons/fa";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  productImage: string;
  orderDetailId: number;
  onSuccess?: () => void; // Callback để reload lại list bên ngoài sau khi thành công
}

export default function ReviewDetailModal({
  open,
  onClose,
  productName,
  productImage,
  orderDetailId,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xử lý chọn ảnh
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Giới hạn 5 ảnh (ví dụ)
      if (selectedFiles.length + filesArray.length > 5) {
        toast.error("Chỉ được chọn tối đa 5 ảnh.");
        return;
      }

      setSelectedFiles((prev) => [...prev, ...filesArray]);

      // Tạo url preview
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  // Xóa ảnh đã chọn
  const removeImage = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newUrls = [...previewUrls];
    URL.revokeObjectURL(newUrls[index]); // cleanup memory
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
  };

  // Gửi đánh giá
  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Dùng FormData để gửi file + text
      const formData = new FormData();
      formData.append("orderDetailId", orderDetailId.toString());
      formData.append("rating", rating.toString());
      formData.append("content", content);
      
      selectedFiles.forEach((file) => {
        formData.append("Images", file); // Tên "Images" phải khớp với DTO backend
      });

      // Gọi API (handleAPI cần hỗ trợ formData, nếu content-type tự động thì ok)
      // Lưu ý: check lại file handleAPI xem nó có tự set header multipart/form-data không
      // Thường axios tự nhận biết khi data là FormData
      await handleAPI("/Review/create", formData, "post");

      toast.success("Cảm ơn bạn đã đánh giá!");
      onSuccess?.(); // Reload dữ liệu cha
      onClose();     // Đóng modal
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data || "Gửi đánh giá thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-lg text-gray-800">Đánh giá sản phẩm</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Product Info */}
          <div className="flex gap-4 mb-6">
            <img src={productImage} alt="Product" className="w-16 h-16 rounded object-cover border" />
            <div>
               <p className="font-medium text-gray-900 line-clamp-2">{productName}</p>
               <p className="text-sm text-gray-500">Chất lượng sản phẩm tuyệt vời chứ?</p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="text-3xl transition-colors duration-200"
              >
                <FaStar
                  className={
                    star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-300"
                  }
                />
              </button>
            ))}
          </div>

          {/* Text Content */}
          <div className="mb-4">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              rows={4}
              placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này nhé..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {/* Button Add Image */}
              <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 flex-shrink-0">
                <FaCamera className="text-gray-400 text-xl" />
                <span className="text-xs text-gray-500 mt-1">Thêm ảnh</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>

              {/* Preview Images */}
              {previewUrls.map((url, index) => (
                <div key={index} className="relative w-20 h-20 flex-shrink-0 group">
                  <img src={url} alt="Preview" className="w-full h-full object-cover rounded-lg border" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTimes size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              disabled={isSubmitting}
            >
              Trở lại
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-70 flex items-center gap-2"
            >
              {isSubmitting ? "Đang gửi..." : "Hoàn thành"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}