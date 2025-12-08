import { useEffect, useState } from "react";
import { toast } from "sonner";
import handleAPI from "@/axios/handleAPI";
import { FaStar, FaCamera, FaTimes } from "react-icons/fa";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  productImage: string;
  orderDetailId: number;
  reviewId?: number;
  initialRating?: number;
  initialContent?: string;
  initialImages?: string[];
  onSuccess?: () => void;
}

export default function ReviewDetailModal({
  open,
  onClose,
  productName,
  productImage,
  orderDetailId,
  reviewId,
  initialRating,
  initialContent,
  initialImages,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(initialRating ?? 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState(initialContent ?? "");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(initialImages ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setRating(initialRating ?? 5);
    setContent(initialContent ?? "");
    setExistingImages(initialImages ?? []);
    setSelectedFiles([]);
    setPreviewUrls([]);
  }, [initialRating, initialContent, initialImages, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (selectedFiles.length + filesArray.length > 5) {
        toast.error("Chỉ chọn tối đa 5 ảnh.");
        return;
      }
      setSelectedFiles((prev) => [...prev, ...filesArray]);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newUrls = [...previewUrls];
    URL.revokeObjectURL(newUrls[index]);
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("rating", rating.toString());
      formData.append("content", content);
      selectedFiles.forEach((file) => formData.append("Images", file));

      if (reviewId) {
        await handleAPI(`api/Review/${reviewId}`, formData, "put");
      } else {
        formData.append("orderDetailId", orderDetailId.toString());
        await handleAPI("api/Review/create", formData, "post");
        }

      toast.success(reviewId ? "Cập nhật đánh giá thành công!" : "Cảm ơn bạn đã đánh giá!");
      onSuccess?.();
      onClose();
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
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-lg text-gray-800">Đánh giá sản phẩm</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <img src={productImage} alt="Product" className="w-16 h-16 rounded object-cover border" />
            <div>
              <p className="font-medium text-gray-900 line-clamp-2">{productName}</p>
              <p className="text-sm text-gray-500">Hãy chia sẻ cảm nhận của bạn.</p>
            </div>
          </div>

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
                <FaStar className={star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-300"} />
              </button>
            ))}
          </div>

          <div className="mb-4">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              rows={4}
              placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="mb-6">
            {existingImages.length > 0 && (
              <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                {existingImages.map((url, idx) => (
                  <div key={idx} className="w-20 h-20 border rounded-lg overflow-hidden flex-shrink-0">
                    <img src={url} alt="review" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 overflow-x-auto pb-2">
              <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 flex-shrink-0">
                <FaCamera className="text-gray-400 text-xl" />
                <span className="text-xs text-gray-500 mt-1">Thêm ảnh</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>

              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative w-20 h-20 border rounded-lg overflow-hidden flex-shrink-0">
                  <img src={url} alt="preview" className="w-full h-full object-cover" />
                  <button
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                    onClick={() => removeImage(idx)}
                    type="button"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 disabled:opacity-60"
          >
            {isSubmitting ? "Đang gửi..." : reviewId ? "Cập nhật đánh giá" : "Gửi đánh giá"}
          </button>
        </div>
      </div>
    </div>
  );
}
