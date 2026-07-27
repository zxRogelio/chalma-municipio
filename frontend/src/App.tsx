import { ProveedorAutenticacion } from './context/ContextoAutenticacion'
import { RutasAplicacion } from './routes/RutasAplicacion'

function App() {
  return (
    <ProveedorAutenticacion>
      <RutasAplicacion />
    </ProveedorAutenticacion>
  )
}

export default App
