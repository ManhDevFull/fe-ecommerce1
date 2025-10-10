"use client"
import { usePathname } from "next/navigation";

export default function OrderPage() {
    const pathname = usePathname();
  const lastSegment = pathname.split("/").pop(); 
  return (
    <div>{lastSegment}</div>
  );
}
