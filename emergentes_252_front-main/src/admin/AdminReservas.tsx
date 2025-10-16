
import { useEffect, useState } from 'react';
import { useAdminStore } from "./context/AdminContext"
import { toast } from 'sonner';
import { FaPaperPlane } from 'react-icons/fa';

const apiUrl = import.meta.env.VITE_API_URL;

type PropostaDetalhada = {
  id: number;
  descricao: string;
  status: 'PENDENTE' | 'NOTIFICADO' | 'CONCLUIDA';
  cliente: { nome: string; email: string };
  sapato: { modelo: string; marca: { nome: string } };
};

export default function AdminReservas() {
  const [propostas, setPropostas] = useState<PropostaDetalhada[]>([]);
  const [loading, setLoading] = useState(true);
  const { admin } = useAdminStore();

  async function fetchPropostas() {
    if (!admin?.token) {
      setLoading(false);
      return;
    };

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/propostas`, {
        headers: { 'Authorization': `Bearer ${admin.token}` }
      });
      const dados = await response.json();
      if (Array.isArray(dados)) {
        setPropostas(dados);
      } else {
        toast.error(dados.erro || "Falha ao carregar os dados das reservas.");
        setPropostas([]);
      }
    } catch (error) {
      toast.error("Erro de conexão ao buscar reservas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPropostas();
  }, [admin]);
  
  async function handleNotificar(propostaId: number) {
    if (!admin?.token) return;
    if (!confirm("Confirmar o envio de e-mail de notificação para este cliente?")) return;

    try {
      const response = await fetch(`${apiUrl}/propostas/${propostaId}/notificar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${admin.token}` }
      });
      
      if (response.ok) {
        toast.success("Cliente notificado com sucesso!");
        fetchPropostas(); 
      } else {
        const erro = await response.json();
        toast.error(erro.erro || "Falha ao notificar o cliente.");
      }
    } catch (error) {
      toast.error("Erro de conexão com a API.");
    }
  }

  if (loading) {
    return <p className="m-4 mt-24 text-center">Carregando reservas...</p>;
  }

  return (
    <div className="m-4 mt-24">
      <h1 className="text-3xl font-bold mb-6">Controle de Reservas e Propostas</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Cliente</th>
              <th scope="col" className="px-6 py-3">Sapato</th>
              <th scope="col" className="px-6 py-3">Descrição da Reserva</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Ação</th>
            </tr>
          </thead>
          <tbody>
            {propostas.map((prop) => (
              <tr key={prop.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>{prop.cliente.nome}</div>
                  <div className="text-xs text-gray-500">{prop.cliente.email}</div>
                </td>
                <td className="px-6 py-4">{prop.sapato.marca.nome} {prop.sapato.modelo}</td>
                <td className="px-6 py-4">{prop.descricao}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    prop.status === 'PENDENTE' ? 'bg-yellow-200 text-yellow-800' : 
                    prop.status === 'NOTIFICADO' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'
                  }`}>
                    {prop.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleNotificar(prop.id)}
                    disabled={prop.status !== 'PENDENTE'}
                    title="Notificar Cliente"
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <FaPaperPlane />
                    Notificar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}