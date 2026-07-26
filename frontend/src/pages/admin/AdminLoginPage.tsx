import { Link } from 'react-router-dom'
import { usePageTitle } from '../../hooks/usePageTitle'

export function AdminLoginPage() {
  usePageTitle('Inicio de sesion administrativo')

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <p className="eyebrow">Administracion</p>
        <h1>Inicio de sesion administrativo</h1>
        <form className="login-form">
          <label>
            Usuario
            <input type="text" name="user" autoComplete="username" />
          </label>
          <label>
            Contrasena
            <input type="password" name="password" autoComplete="current-password" />
          </label>
          <button type="button">Entrar</button>
        </form>
        <Link to="/">Volver al portal</Link>
      </section>
    </main>
  )
}
