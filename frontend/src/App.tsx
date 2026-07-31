import { ProveedorAutenticacion } from './context/ProveedorAutenticacion'
import { RutasAplicacion } from './routes/RutasAplicacion'

function App() {
  return (
    <ProveedorAutenticacion>
      <RutasAplicacion />
    </ProveedorAutenticacion>
  )
}

export default App
