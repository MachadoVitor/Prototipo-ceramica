export default function EmptyState({ icon: Icon, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {Icon && (
        <div className="w-20 h-20 bg-clay-100 rounded-3xl flex items-center justify-center mb-5">
          <Icon size={40} className="text-clay-300" strokeWidth={1.5} />
        </div>
      )}
      <p className="text-base text-clay-400 font-medium mb-6">{message}</p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="bg-clay-700 text-white px-6 py-3.5 rounded-2xl text-base font-bold active:bg-clay-800 transition-colors shadow-lg shadow-clay-700/20"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
