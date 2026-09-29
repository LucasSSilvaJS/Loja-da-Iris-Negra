import { NavLink } from 'react-router-dom'
import { catalogService } from '../../services/catalog.service'
import { useResource } from '../../hooks/useResource'

export function CategoryNav() {
  const state = useResource('categories', () => catalogService.categories())

  return (
    <nav className="rail" aria-label="Tipos de produto">
      <NavLink className="portrait-link" to="/" end aria-label="Íris Negra, início">
        <img className="portrait" src="/base/logo-iris.png" alt="" />
      </NavLink>
      {state.status === 'loading' && <p className="status">abrindo as prateleiras…</p>}
      {state.status === 'error' && (
        <p className="status status-error" role="alert">
          {state.error}
        </p>
      )}
      <ul className="rail-list">
        <li>
          <NavLink className="magenta-btn" to="/" end>
            <span className="btn-title">Destaque</span>
          </NavLink>
        </li>
        {state.status === 'ready' &&
          state.data.map((category) => (
            <li key={category.slug}>
              <NavLink className="magenta-btn" to={`/categoria/${category.slug}`}>
                <span className="btn-title">{category.name}</span>
              </NavLink>
            </li>
          ))}
        <li className="is-about">
          <NavLink className="magenta-btn about-btn" to="/sobre">
            <span className="btn-title">Sobre</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
