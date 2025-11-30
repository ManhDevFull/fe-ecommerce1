import { useEffect, useState } from "react"
import { FiMinus } from "react-icons/fi"
import { GoPlus } from "react-icons/go"
type prop = {
    onchange: (quantity: number) => void
}
export default function Quantity({onchange} : prop) {
    const [value, setValue] = useState<number>(1);
    useEffect(() => {
        onchange(value);
    }, [value]);
    const increase = () => {
        setValue(prev => prev + 1);
    }
    const decrease = () => {
        setValue(prev => {
            if (prev == 0)
                return 1;
            return prev - 1;
        });
    }
    return (
        <div className="flex justify-between items-center w-[200px] border-2 rounded-[20px] border-[#E4E7E9] p-2">
            <GoPlus size={20} onClick={increase} />
            <p className="text-[#475156] text-[20px]">{value}</p>
            <FiMinus size={20} onClick={decrease} />
        </div>
    )
}