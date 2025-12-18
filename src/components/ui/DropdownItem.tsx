type DropdownItemProps = {
    label: string;
    active?: boolean;
    onClick: () => void;
};

export function DropdownItem({ label, active, onClick }: DropdownItemProps) {
    return (
        <div
            onClick={onClick}
            className={`
                px-3 py-2
                text-sm
                cursor-pointer
                border-b border-[#F1F3F5]
                last:border-b-0
                transition
                ${active
                    ? "bg-[#1877F2] text-white"
                    : "hover:bg-[#F1F5FF] text-[#475156]"
                }
            `}
        >
            {label}
        </div>
    );
}
