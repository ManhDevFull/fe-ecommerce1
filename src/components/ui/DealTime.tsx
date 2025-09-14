import { useEffect, useState } from "react";

type timeUnit = {
    endTime: Date;
    unit: {
        day?: string,
        hour: string,
        min: string,
        sec: string
    }
}
export default function DealTime({ endTime, unit }: timeUnit) {
    const totalTime =Math.floor((endTime.getTime() - Date.now()) / 1000);
    const [timeLeft, setTimeLeft] = useState(totalTime);
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000)
        return () => clearInterval(timer);
    })
    const day = unit.day ?Math.floor(timeLeft / 86400) : 0 ;
    const hour = unit.day ?Math.floor(((timeLeft % 86400) / 3600)) : Math.floor((timeLeft / 3600));
    const min = unit.day ?Math.floor((((timeLeft % 86400) % 3600) / 60)) : Math.floor((timeLeft % 3600) / 60);
    const sec = unit.day ?Math.floor((((timeLeft % 86400) % 3600) % 60)) :Math.floor(timeLeft % 60);
    return (
        <div className="mt-2 sm:mt-0 sm:h-[30px] md:h-[40px] flex items-center text-center bg-yellow-400 rounded-[10px]">
            <p className="font-bold sm:p-1 md:p-2 lg:p-4 p-2">
               {`${unit.day ? `${day}${unit.day} : ` : ''}${hour}${unit.hour}: ${min}${unit.min} : ${sec}${unit.sec}`}
            </p>
        </div>
    )
}