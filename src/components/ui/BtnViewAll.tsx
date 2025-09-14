import { useRouter } from "next/navigation"
type classProps = {
    className: string
}
export function BtnViewAll({ className }: classProps) {
    const router = useRouter();
    return (
        <div onClick={() => router.push('')} className={`flex h-[40px] p-4 items-center justify-center mt-2 sm:h-[30px] sm:p-1 sm:mt-0 md:h-[40px] xl:h-[50px] xl:w-[150px] md:p-2 bg-yellow-400 rounded-[10px] cursor-pointer hover:bg-gray-900 transition-colors duration-200 ease-in-out ${className}`}>
            <p className="font-medium text-center">View All</p>
        </div>
    )
}