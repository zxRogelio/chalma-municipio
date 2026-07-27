import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LayoutAdministrador } from '../components/admin/LayoutAdministrador'
import { RutaAdministrador } from '../components/admin/RutaAdministrador'
import { PublicLayout } from '../layouts/PublicLayout'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminLoginPage } from '../pages/admin/AdminLoginPage'
import { PaginaDetalleCategoriaAdministracion } from '../pages/admin/PaginaDetalleCategoriaAdministracion'
import { PaginaDocumentosCategoriaAdministracion } from '../pages/admin/PaginaDocumentosCategoriaAdministracion'
import { PaginaSeccionTransparenciaAdministracion } from '../pages/admin/PaginaSeccionTransparenciaAdministracion'
import { PaginaTransparenciaAdministracion } from '../pages/admin/PaginaTransparenciaAdministracion'
import { AboutPage } from '../pages/public/AboutPage'
import { ContactPage } from '../pages/public/ContactPage'
import { CouncilPage } from '../pages/public/CouncilPage'
import { DepartmentsPage } from '../pages/public/DepartmentsPage'
import { DirectoryPage } from '../pages/public/DirectoryPage'
import { GovernmentPage } from '../pages/public/GovernmentPage'
import { HomePage } from '../pages/public/HomePage'
import { NotFoundPage } from '../pages/public/NotFoundPage'
import { OrganizationPage } from '../pages/public/OrganizationPage'
import { PaginaDetalleObligacionComun } from '../pages/public/PaginaDetalleObligacionComun'
import { PaginaDocumentosTransparencia } from '../pages/public/PaginaDocumentosTransparencia'
import { PaginaObligacionesComunes } from '../pages/public/PaginaObligacionesComunes'
import { PaginaTransparencia } from '../pages/public/PaginaTransparencia'
import { ProceduresServicesPage } from '../pages/public/ProceduresServicesPage'
import { transparencySections } from '../data/siteContent'

export function RutasAplicacion() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<RutaAdministrador />}>
          <Route path="/admin" element={<LayoutAdministrador />}>
            <Route index element={<AdminDashboardPage />} />
            <Route
              path="transparencia"
              element={<PaginaTransparenciaAdministracion />}
            />
            <Route
              path="transparencia/secciones/:id"
              element={<PaginaSeccionTransparenciaAdministracion />}
            />
            <Route
              path="transparencia/categorias"
              element={<Navigate to="/admin/transparencia" replace />}
            />
            <Route
              path="transparencia/categorias/:id"
              element={<PaginaDetalleCategoriaAdministracion />}
            />
            <Route
              path="transparencia/categorias/:id/documentos"
              element={<PaginaDocumentosCategoriaAdministracion />}
            />
          </Route>
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/gobierno" element={<GovernmentPage />} />
          <Route path="/gobierno/acerca-de" element={<AboutPage />} />
          <Route path="/gobierno/organigrama" element={<OrganizationPage />} />
          <Route path="/gobierno/cabildo" element={<CouncilPage />} />
          <Route path="/gobierno/directorio" element={<DirectoryPage />} />
          <Route path="/gobierno/dependencias" element={<DepartmentsPage />} />
          <Route path="/transparencia" element={<PaginaTransparencia />} />
          <Route
            path="/transparencia/obligaciones-comunes"
            element={<PaginaObligacionesComunes />}
          />
          <Route
            path="/transparencia/obligaciones-comunes/:slug"
            element={<PaginaDetalleObligacionComun />}
          />
          <Route
            path="/transparencia/obligaciones-especificas"
            element={<PaginaDocumentosTransparencia section={transparencySections.specific} />}
          />
          <Route
            path="/transparencia/obras-publicas"
            element={<PaginaDocumentosTransparencia section={transparencySections.works} />}
          />
          <Route
            path="/transparencia/fondos-federales"
            element={<PaginaDocumentosTransparencia section={transparencySections.funds} />}
          />
          <Route
            path="/transparencia/informacion-financiera"
            element={<PaginaDocumentosTransparencia section={transparencySections.finance} />}
          />
          <Route
            path="/transparencia/cuenta-publica"
            element={<PaginaDocumentosTransparencia section={transparencySections.account} />}
          />
          <Route
            path="/transparencia/licitaciones"
            element={<PaginaDocumentosTransparencia section={transparencySections.bids} />}
          />
          <Route
            path="/tramites-servicios"
            element={<ProceduresServicesPage />}
          />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
