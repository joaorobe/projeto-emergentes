
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdminStore } from "./context/AdminContext"
import { toast } from 'sonner';

const apiUrl = import.meta.env.VITE_API_URL;

type Proposta = {
  id: number;
  descricao: string;
  status: string;
  sapato: {
    id: number;
    modelo: string;
    marca: { nome: string };
  };
};

type Cliente = {
  nome: string;
};

export default function AdminClienteReservas() {
  const { clienteId } = useParams<{ clienteId: string }>();
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const { admin } = useAdminStore();

  useEffect(() => {
    async function fetchReservasCliente() {
      if (!admin?.token || !clienteId) return;
      
      setLoading(true);
      try {
        const clienteResponse = await fetch(`${apiUrl}/clientes/${clienteId}`);
        const clienteData = await clienteResponse.json();
        setCliente(clienteData);
        const propostasResponse = await fetch(`${apiUrl}/propostas/${clienteId}`);
        const propostasData = await propostasResponse.json();
        setPropostas(propostasData);

      } catch (error) {
        toast.error("Erro ao buscar dados do cliente.");
      } finally {
        setLoading(false);
      }
    }

    fetchReservasCliente();
  }, [clienteId, admin]);

  if (loading) {
    return <p className="m-4 mt-24 text-center">Carregando reservas...</p>;
  }

  return (
    <div className="m-4 mt-24">
      <h1 className="text-3xl font-bold mb-6">
        Reservas de: <span className="text-blue-600">{cliente?.nome || 'Cliente'}</span>
      </h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Sapato</th>
              <th scope="col" className="px-6 py-3">Descrição</th>
              <th scope="col" className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {propostas.length > 0 ? propostas.map((proposta) => (
              <tr key={proposta.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  <Link to={`/detalhes/${proposta.sapato.id}`} className="hover:underline">
                    {proposta.sapato.marca.nome} {proposta.sapato.modelo}
                  </Link>
                </td>
                <td className="px-6 py-4">{proposta.descricao}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    proposta.status === 'PENDENTE' ? 'bg-yellow-200 text-yellow-800' : 
                    proposta.status === 'NOTIFICADO' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'
                  }`}>
                    {proposta.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  Este cliente não possui nenhuma reserva.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}