const ValueCard = ({ icon: Icon, title, children }) => (
  <div className="flex-1 min-w-[220px] max-w-[340px] rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <div className="rounded-xl border border-zinc-200 p-2">
        <Icon className="w-5 h-5" aria-hidden />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
    </div>
    <p className="text-sm text-zinc-600">{children}</p>
  </div>
)

export default ValueCard