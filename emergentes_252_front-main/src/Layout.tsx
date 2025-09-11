
import Titulo from './components/Titulo'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { useClienteStore } from './context/ClienteContext'

const apiUrl = import.meta.env.VITE_API_URL

export default function Layout() {
  const { logaCliente } = useClienteStore()
  useEffect(() => {
    async function buscaCliente(id: string) {
      const response = await fetch(`${apiUrl}/clientes/${id}`)
      const dados = await response.json()
      logaCliente(dados)
    }
    if (localStorage.getItem("clienteKey")) {
      const idCliente = localStorage.getItem("clienteKey") as string
      buscaCliente(idCliente)
    }    
  }, [])

  return (
    <>
      <Titulo />
      <Outlet />
      <Toaster richColors position="top-center" />
    </>
  )
}