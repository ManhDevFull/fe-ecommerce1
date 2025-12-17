import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiArrowDropDownLine } from "react-icons/ri";

type DropdownProps = {
    value: string;
    children: (close: () => void) => React.ReactNode;
};

export default function Dropdown({ value, children }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative w-full">
            {/* Trigger */}
            <div
                onClick={() => setIsOpen(prev => !prev)}
                className="
                    flex items-center justify-between
                    px-3 py-2
                    border border-[#E4E7E9]
                    rounded-lg
                    cursor-pointer
                    bg-white
                    hover:border-[#1877F2]
                    transition
                "
            >
                <span className="text-sm font-medium text-[#191C1F]">
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>

                <RiArrowDropDownLine
                    size={26}
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </div>

            {/* Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="
                            absolute z-20 mt-2 w-full
                            bg-white
                            border border-[#E4E7E9]
                            rounded-lg
                            shadow-md
                            overflow-hidden
                        "
                    >
                        {children(() => setIsOpen(false))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
