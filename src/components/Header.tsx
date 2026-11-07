import { Link } from "react-router-dom"


export function Header() {
  return (
    <header className="flex items-center justify-between px-48 py-4">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="w-10 h-12" />
      </div>

      <div className=" flex flex-row items-center justify-center px-2 p-2 rounded-lg">
        <nav className="hidden md:flex gap-4">
          <Link to="/" className="px-5 py-2 text-gray-600 font-medium text-xs hover:text-gray-900 backdrop-blur-md border border-gray-800 hover:border-slate-300/20 rounded-xl shadow-sm transition-all active:scale-95">HOME</Link>
          <Link to="/commodities" onMouseEnter={() => import('../pages/Commodities')} className="text-gray-600 px-5 py-2 font-medium text-xs hover:text-gray-900 backdrop-blur-md border border-gray-800 hover:border-slate-300/20 rounded-xl shadow-sm transition-all active:scale-95">COMMODITIES</Link>
        </nav>
      </div>
    </header>
  )
}