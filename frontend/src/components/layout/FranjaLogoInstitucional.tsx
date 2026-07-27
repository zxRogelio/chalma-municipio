const LOGO_INSTITUCIONAL = '/assets/img/logo-chalma-oficial.png'

export function FranjaLogoInstitucional() {
  return (
    <section className="institutional-logo-band" aria-label="Identidad institucional">
      <img
        src={LOGO_INSTITUCIONAL}
        alt="Logo oficial del H. Ayuntamiento de Chalma"
      />
    </section>
  )
}
