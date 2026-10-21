import { Link, NavLink } from 'react-router-dom'
import { Icon } from '../design-system'
import ThemeToggle from './ThemeToggle'

const navClass = ({ isActive }) =>
  'inline-flex items-center gap-2 rounded-token-md px-3 py-2 font-sans font-bold text-fg ' +
  (isActive ? 'bg-panel' : 'hover:bg-panel')

export default function Header() {
  return (
    <header className="border-b-[2.5px] border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="font-display text-2xl font-bold text-fg">
          SwapMeet
        </Link>
        <nav aria-label="Main" className="flex flex-wrap items-center gap-2">
          <NavLink to="/" end className={navClass}>
            <Icon name="search" size={20} />
            Browse
          </NavLink>
          <NavLink to="/sell" className={navClass}>
            <Icon name="sell" size={20} />
            Sell
          </NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
