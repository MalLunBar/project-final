import { Link } from "react-router-dom"

const CardLink = ({ to, icon: Icon, label, className = "" }) => {
  return (
    <Link
      to={to}
      className={[
        "flex flex-col items-center gap-2 flex-1 min-w-[45%] rounded-2xl p-5 text-center",
        "shadow-sm bg-white/100 hover:bg-black/30 transition",
        className,
      ].join(" ")}
    >
      <span className="inline-flex items-center justify-center rounded-xl">
        <Icon className="w-6 h-6" />
      </span>
      <span className="font-medium">{label}</span>
    </Link>
  )
}

export default CardLink
