'use client'
import { GrPrevious } from "react-icons/gr";
import { CiShare2 } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function BackNavigation() {
  const router = useRouter();
  return (
    <div className="w-full flex justify-between items-center px-10 md:px-15 py-2 xl:px-40 pt-4">
      <div className="flex items-center gap-2 " onClick={() => router.back()}>
        <div
          className=" flex items-center justify-center w-[50px] h-[50px]
                 border-2 border-[#C1C1C1] rounded-3xl"
        >
          <GrPrevious size={20} />
        </div>
        <h3 className="hidden sm:block font-bold text-2xl text-black">Back</h3>
      </div>
      <div
        className="items-center"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Copied successfully!");
          } catch (error) {
            toast.error("Failed to copy URL.");
            console.error("Failed to copy: ", error);
          }
        }}
      >
        <CiShare2 size={30} />
      </div>
    </div>
  );
}
