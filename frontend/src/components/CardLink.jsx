import { Link } from "react-router-dom"

const CardLink = ({ to, icon: Icon, iconColor, label, className = "" }) => {
  return (
    <Link
      to={to}
      className={[
        "flex flex-col items-center gap-2 flex-1 min-w-[45%] rounded-2xl p-5 text-center",
        "border border-zinc-200 shadow-sm bg-white  transition",
        className,
      ].join(" ")}
    >
      <span className={`text-${iconColor}`}>
        <Icon size={28} aria-hidden />
      </span>
      <h3 className="font-medium">{label}</h3>
    </Link>
  )
}

export default CardLink
