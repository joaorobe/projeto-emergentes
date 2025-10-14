
import { Link } from "react-router-dom";
import { useClienteStore } from "../context/ClienteContext"; 
import { useNavigate } from "react-router-dom";

export default function Titulo() {
  const { cliente, deslogaCliente } = useClienteStore();
  const navigate = useNavigate();

  function clienteSair() {
    if (confirm("Confirma saída do sistema?")) {
      deslogaCliente();
      if (localStorage.getItem("clienteKey")) {
        localStorage.removeItem("clienteKey");
      }
      navigate("/login");
    }
  }

  return (
    <nav className="border-gray-300 bg-white dark:border-gray-700 border-b h-24">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4 h-full">
        <div className="flex-1">
        </div>
        <div className="flex-1 text-center">
          <Link to="/" className="flex items-center justify-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-4xl font-bold whitespace-nowrap text-black">
              SAPATARIA AVENIDA
            </span>
          </Link>
        </div>
        <div className="flex-1 flex justify-end items-center">
          <div className="hidden md:block" id="navbar-solid-bg">
            <ul className="flex items-center font-medium space-x-4">
              <li>
                {cliente ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-black">Olá, {cliente.nome}</span>
                    <Link to="/minhasPropostas" className="text-white font-bold bg-black hover:bg-gray-700 px-3 py-2 rounded-lg text-sm">
                      Minhas Reservas
                    </Link>
                    <span className="cursor-pointer font-bold text-black" onClick={clienteSair}>
                      Sair
                    </span>
                  </div>
                ) : (
                  <Link to="/login" className="text-gray-900 hover:text-blue-700 font-semibold text-2xl">
                  Login 👤
                  </Link>
                )}
              </li>
            </ul>
          </div>
          <button data-collapse-toggle="navbar-solid-bg" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}