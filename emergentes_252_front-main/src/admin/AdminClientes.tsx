
import { useEffect, useState } from 'react';
import { useAdminStore } from "./context/AdminContext"
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { FaTrash, FaListAlt } from 'react-icons/fa';

const apiUrl = import.meta.env.VITE_API_URL;

type ClienteAdmin = {
  id: string;
  nome: string;
  email: string;
  cidade: string;
  data_nasc: string;
  _count: {
    propostas: number;
  };
};

export default function AdminClientes() {
  const [clientes, setClientes] = useState<ClienteAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const { admin } = useAdminStore();

  async function fetchClientes() {
    if (!admin?.token) {
      toast.error("Autenticação necessária.");
      setLoading(false); return;
    }
    try {
      const response = await fetch(`${apiUrl}/clientes`, { headers: { 'Authorization': `Bearer ${admin.token}` } });
      if (response.ok) {
        const dados = await response.json();
        if (Array.isArray(dados)) { setClientes(dados); } 
        else { toast.error("A resposta do servidor não é válida."); }
      } else {
        toast.error("Falha ao buscar a lista de clientes.");
      }
    } catch (error) {
      toast.error("Erro de conexão com a API.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClientes();
  }, [admin]);
  
  async function handleExcluir(clienteId: string, nomeCliente: string) {
    if (!admin?.token) return;
    if (confirm(`Deseja realmente excluir o cliente "${nomeCliente}"? Todas as suas reservas também serão removidas.`)) {
      try {
        const response = await fetch(`${apiUrl}/clientes/${clienteId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${admin.token}` }
        });

        if (response.ok) {
          toast.success("Cliente excluído com sucesso!");
          setClientes(clientes.filter(c => c.id !== clienteId));
        } else {
          const erro = await response.json();
          toast.error(erro.erro || "Falha ao excluir o cliente.");
        }
      } catch (error) {
        toast.error("Erro de conexão ao tentar excluir.");
      }
    }
  }

  if (loading) {
    return <p className="m-4 mt-24 text-center">Carregando lista de clientes...</p>;
  }

  return (
    <div className="m-4 mt-24">
      <h1 className="text-3xl font-bold mb-6">Controle de Clientes Cadastrados</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Nome do Cliente</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Nº de Reservas</th>
              <th scope="col" className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{cliente.nome}</td>
                <td className="px-6 py-4">{cliente.email}</td>
                <td className="px-6 py-4 text-center font-bold">{cliente._count.propostas}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-4">
                    <Link to={`/admin/clientes/reservas/${cliente.id}`} title="Ver Reservas" className="text-blue-600 hover:text-blue-800">
                      <FaListAlt className="text-lg" />
                    </Link>
                    <button onClick={() => handleExcluir(cliente.id, cliente.nome)} title="Excluir Cliente" className="text-red-600 hover:text-red-800">
                      <FaTrash className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}