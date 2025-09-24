import { useState } from "react";

type AccordionProps = {
    title: string;
    children: React.ReactNode;
}
export default function AccordionItem({ title, children }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div>
            <div className="flex items-center justify-between">
                <p className="text-[20px]">{title}</p>
                <p className="text-[20px]">{isOpen ? '+' : '-'}</p>
            </div>
            {isOpen && <div>{children}</div>}
        </div>
    )
}