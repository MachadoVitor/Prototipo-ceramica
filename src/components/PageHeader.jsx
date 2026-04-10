export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between px-5 pt-8 pb-4">
      <div>
        <h1 className="text-2xl font-extrabold text-clay-900 tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-clay-400 font-medium mt-0.5">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  )
}
