import { StrictMode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/style.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Productos from './pages/Productos.jsx'
import Nosotros from './pages/Nosotros.jsx'
import Blogs from './pages/Blogs.jsx'
import Contacto from './pages/Contacto.jsx'
import Registro from './pages/Registro.jsx'
import Carrito from './pages/Carrito.jsx'
import LoginAdmin from './pages/LoginAdmin.jsx'
import LoginUsuario from './pages/LoginUsuario.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import Favoritos from './pages/Favoritos.jsx'
import ProductoDetalle from './pages/ProductoDetalle.jsx'
import AdminProductos from './pages/AdminProductos.jsx'
import AdminProductoNuevo from './pages/AdminProductoNuevo.jsx'
import AdminProductoEditar from './pages/AdminProductoEditar.jsx'
import AdminUsuarios from './pages/AdminUsuarios.jsx'
import AdminOrdenes from './pages/AdminOrdenes.jsx'
import MisPedidos from './pages/MisPedidos.jsx'

async function prepareMocks() {
  const useMocks = import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true'
  if (useMocks) {
    const { startWorker } = await import('./mocks/browser')
    await startWorker()
  }
}

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/productos', element: <Productos /> },
      { path: '/producto/:id', element: <ProductoDetalle /> },
      { path: '/nosotros', element: <Nosotros /> },
      { path: '/blogs', element: <Blogs /> },
      { path: '/contacto', element: <Contacto /> },
      { path: '/registro', element: <Registro /> },
      { path: '/carrito', element: <Carrito /> },
      { path: '/login-admin', element: <LoginAdmin /> },
      { path: '/login-usuario', element: <LoginUsuario /> },
      { path: '/favoritos', element: <PrivateRoute><Favoritos /></PrivateRoute> },
      { path: '/mis-pedidos', element: <PrivateRoute><MisPedidos /></PrivateRoute> },
      { path: '/admin/productos', element: <AdminRoute><AdminProductos /></AdminRoute> },
      { path: '/admin/productos/nuevo', element: <AdminRoute><AdminProductoNuevo /></AdminRoute> },
      { path: '/admin/productos/:id/editar', element: <AdminRoute><AdminProductoEditar /></AdminRoute> },
      { path: '/admin/usuarios', element: <AdminRoute><AdminUsuarios /></AdminRoute> },
      { path: '/admin/ordenes', element: <AdminRoute><AdminOrdenes /></AdminRoute> },
    ],
  },
])

prepareMocks().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
})
