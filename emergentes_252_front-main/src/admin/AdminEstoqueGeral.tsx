
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminStore } from "./context/AdminContext"
import { toast } from 'sonner';

const apiUrl = import.meta.env.VITE_API_URL;

type EstoqueDetalhado = {
  id: number;
  tamanho: string;
  cor: string;
  preco: number;
  quantidade: number;
  sapato: {
    id: number;
    modelo: string;
    marca: {
      nome: string;
    };
  };
};

export default function AdminEstoqueGeral() {
  const [estoques, setEstoques] = useState<EstoqueDetalhado[]>([]);
  const [loading, setLoading] = useState(true);
  const { admin } = useAdminStore();

  useEffect(() => {
    async function fetchTodosEstoques() {
      if (!admin?.token) {
        toast.error("Autenticação necessária.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/estoques`, {
          headers: {
            'Authorization': `Bearer ${admin.token}`
          }
        });

        if (response.ok) {
          const dados = await response.json();
          setEstoques(dados);
        } else {
          toast.error("Falha ao buscar dados de estoque.");
        }
      } catch (error) {
        toast.error("Erro de conexão com a API.");
      } finally {
        setLoading(false);
      }
    }

    fetchTodosEstoques();
  }, [admin]);

  if (loading) {
    return <p className="m-4 mt-24 text-center">Carregando estoque...</p>;
  }

  return (
    <div className="m-4 mt-24">
      <h1 className="text-3xl font-bold mb-6">Controle Geral de Estoque</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Modelo do Sapato</th>
              <th scope="col" className="px-6 py-3">Marca</th>
              <th scope="col" className="px-6 py-3">Tamanho</th>
              <th scope="col" className="px-6 py-3">Cor</th>
              <th scope="col" className="px-6 py-3">Preço R$</th>
              <th scope="col" className="px-6 py-3">Quantidade</th>
              <th scope="col" className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {estoques.map((item) => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{item.sapato.modelo}</td>
                <td className="px-6 py-4">{item.sapato.marca.nome}</td>
                <td className="px-6 py-4">{item.tamanho.replace('T_', '')}</td>
                <td className="px-6 py-4">{item.cor}</td>
                <td className="px-6 py-4">{Number(item.preco).toLocaleString('pt-br', { minimumFractionDigits: 2 })}</td>
                <td className={`px-6 py-4 font-bold ${item.quantidade < 10 ? 'text-red-600' : 'text-green-600'}`}>
                  {item.quantidade}
                </td>
                <td className="px-6 py-4">
                  <Link 
                    to={`/admin/sapatos/estoque/${item.sapato.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Gerenciar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}