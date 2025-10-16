import { useAdminStore } from "../context/AdminContext"
import { IoExitOutline } from "react-icons/io5"
import { BiSolidDashboard } from "react-icons/bi"
import { FaUsers } from "react-icons/fa6"
import { GiConverseShoe } from "react-icons/gi";
import { BsCashCoin } from "react-icons/bs"
import { IoIosArchive } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom"

export function MenuLateral() {
  const navigate = useNavigate()
  const { deslogaAdmin } = useAdminStore()

  function adminSair() {
    if (confirm("Confirma Saída?")) {
      deslogaAdmin()
      navigate("/", { replace: true })
    }
  }

  return (
    <aside id="default-sidebar" className="fixed mt-24 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto bg-blue-300 dark:bg-black">
        <ul className="space-y-2 font-medium">
        <li>
            <Link to="/admin" className="flex items-center p-2 bg-black text-white hover:bg-white hover:text-black focus:outline-none focus:ring-4 focus:ring-gray-400 font-medium rounded-lg text-sm text-center transition-colors duration-5">
              <span className="h-5  text-2xl">
                <BiSolidDashboard />
              </span>
              <span className="ms-2 mt-1 ">Visão Geral</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/sapatos" className="flex items-center p-2 bg-black text-white hover:bg-white hover:text-black focus:outline-none focus:ring-4 focus:ring-gray-400 font-medium rounded-lg text-sm text-center transition-colors duration-5">
              <span className="h-5 text-2xl">
              <GiConverseShoe />
              </span>
              <span className="ms-2 mt-1">Cadastro de Sapatos</span>
            </Link>
          </li>
          <li>
          <Link to="/admin/estoques" className="flex items-center p-2 bg-black text-white hover:bg-white hover:text-black focus:outline-none focus:ring-4 focus:ring-gray-400 font-medium rounded-lg text-sm text-center transition-colors duration-5">
              <span className="h-5 text-2xl">
              <IoIosArchive />
              </span>
              <span className="ms-2 mt-1">Controle de Estoque</span>
            </Link>
          </li>
          <li>
          <Link to="/admin/clientes" className="flex items-center p-2 bg-black text-white hover:bg-white hover:text-black focus:outline-none focus:ring-4 focus:ring-gray-400 font-medium rounded-lg text-sm text-center transition-colors duration-5">
              <span className="h-5 text-2xl">
                <FaUsers />
              </span>
              <span className="ms-2 mt-1">Controle de Clientes</span>
            </Link>
          </li>
          <li>
          <Link to="/admin/reservas" className="flex items-center p-2 cursor-pointer bg-black text-white hover:bg-white hover:text-black focus:outline-none focus:ring-4 focus:ring-gray-400 font-medium rounded-lg text-sm text-center transition-colors duration-5">
              <span className="h-5 text-2xl">
                <BsCashCoin />
              </span>
              <span className="ms-2 mt-1">Controle de Reservas</span>
            </Link>
          </li>

          <li>
            <span className="flex items-center p-2 cursor-pointer bg-black text-white hover:bg-white hover:text-black focus:outline-none focus:ring-4 focus:ring-gray-400 font-medium rounded-lg text-sm text-center transition-colors duration-5">
              <span className="h-5 text-2xl">
                <IoExitOutline />
              </span>
              <span className="ms-2 mt-1" onClick={adminSair}>Sair do Sistema</span>
            </span>
          </li>
        </ul>
      </div>
    </aside>
  )
}