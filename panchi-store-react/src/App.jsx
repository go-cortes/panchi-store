import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <main style={{ marginTop: '76px' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default App
