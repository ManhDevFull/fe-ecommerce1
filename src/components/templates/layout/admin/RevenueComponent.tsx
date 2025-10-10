interface Props {
  className?: string,
}
export default function RevenueComponent({className}: Props){
  return <div className={`${className} p-4 pr-10`}>
    <div className="bg-[#F7F7F7] h-full w-full shadow-[0px_2px_4px_rgba(0,0,0,0.25)] rounded-lg">
      Revenue
    </div>
  </div>
}