import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PublicLayout } from '../layouts/PublicLayout'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminLoginPage } from '../pages/admin/AdminLoginPage'
import { AboutPage } from '../pages/public/AboutPage'
import { ContactPage } from '../pages/public/ContactPage'
import { CouncilPage } from '../pages/public/CouncilPage'
import { DepartmentsPage } from '../pages/public/DepartmentsPage'
import { DirectoryPage } from '../pages/public/DirectoryPage'
import { GovernmentPage } from '../pages/public/GovernmentPage'
import { HomePage } from '../pages/public/HomePage'
import { NotFoundPage } from '../pages/public/NotFoundPage'
import { OrganizationPage } from '../pages/public/OrganizationPage'
import { ProceduresServicesPage } from '../pages/public/ProceduresServicesPage'
import { TransparencyDocumentPage } from '../pages/public/TransparencyDocumentPage'
import { TransparencyPage } from '../pages/public/TransparencyPage'
import { transparencySections } from '../data/siteContent'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />

        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/gobierno" element={<GovernmentPage />} />
          <Route path="/gobierno/acerca-de" element={<AboutPage />} />
          <Route path="/gobierno/organigrama" element={<OrganizationPage />} />
          <Route path="/gobierno/cabildo" element={<CouncilPage />} />
          <Route path="/gobierno/directorio" element={<DirectoryPage />} />
          <Route path="/gobierno/dependencias" element={<DepartmentsPage />} />
          <Route path="/transparencia" element={<TransparencyPage />} />
          <Route
            path="/transparencia/obligaciones-comunes"
            element={<TransparencyDocumentPage section={transparencySections.common} />}
          />
          <Route
            path="/transparencia/obligaciones-especificas"
            element={<TransparencyDocumentPage section={transparencySections.specific} />}
          />
          <Route
            path="/transparencia/obras-publicas"
            element={<TransparencyDocumentPage section={transparencySections.works} />}
          />
          <Route
            path="/transparencia/fondos-federales"
            element={<TransparencyDocumentPage section={transparencySections.funds} />}
          />
          <Route
            path="/transparencia/informacion-financiera"
            element={<TransparencyDocumentPage section={transparencySections.finance} />}
          />
          <Route
            path="/transparencia/cuenta-publica"
            element={<TransparencyDocumentPage section={transparencySections.account} />}
          />
          <Route
            path="/transparencia/licitaciones"
            element={<TransparencyDocumentPage section={transparencySections.bids} />}
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
