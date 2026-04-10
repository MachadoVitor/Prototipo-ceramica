import { NavLink } from 'react-router-dom'
import { Package, BookOpen, Home, Play, User } from 'lucide-react'

const tabs = [
  { to: '/materiais', icon: Package, label: 'Materiais' },
  { to: '/receitas', icon: BookOpen, label: 'Receitas' },
  { to: '/', icon: Home, label: 'Início', center: true },
  { to: '/produzir', icon: Play, label: 'Produzir' },
  { to: '/perfil', icon: User, label: 'Perfil' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      <div className="max-w-lg mx-auto relative">
        <div className="bg-white/95 backdrop-blur-md border-t border-clay-200 flex justify-around items-end h-16 px-2">
          {tabs.map(({ to, icon: Icon, label, center }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center transition-all
                ${center
                  ? '-mt-5 relative z-10'
                  : `px-1 py-1.5 min-w-[52px] ${isActive ? 'text-clay-800' : 'text-clay-400'}`
                }`
              }
            >
              {({ isActive }) =>
                center ? (
                  <>
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-br from-clay-600 to-clay-800 shadow-clay-700/40'
                          : 'bg-gradient-to-br from-clay-500 to-clay-700 shadow-clay-600/30'
                      }`}
                    >
                      <Icon size={26} className="text-white" strokeWidth={2.2} />
                    </div>
                    <span className={`text-[10px] mt-1 font-bold ${isActive ? 'text-clay-800' : 'text-clay-500'}`}>
                      {label}
                    </span>
                  </>
                ) : (
                  <>
                    <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-clay-100' : ''}`}>
                      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className={`text-[10px] font-semibold ${isActive ? 'font-bold' : ''}`}>
                      {label}
                    </span>
                  </>
                )
              }
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
