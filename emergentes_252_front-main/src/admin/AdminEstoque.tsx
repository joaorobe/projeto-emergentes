import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { SapatoType } from '../utils/SapatoType';
import type { EstoqueType } from '../utils/EstoqueType';
import { useForm } from 'react-hook-form';
import ItemEstoque from './components/ItemEstoque';
import { toast } from 'sonner';

const apiUrl = import.meta.env.VITE_API_URL;

type FormInputs = Omit<EstoqueType, 'id'>;

export default function AdminEstoque() {
  const { sapatoId } = useParams<{ sapatoId: string }>();
  const [sapato, setSapato] = useState<SapatoType | null>(null);
  const [estoques, setEstoques] = useState<EstoqueType[]>([]);
  const { register, handleSubmit, reset } = useForm<FormInputs>();

  async function fetchDados() {
    const sapatoResponse = await fetch(`${apiUrl}/sapatos/${sapatoId}`);
    const sapatoDados = await sapatoResponse.json();
    setSapato(sapatoDados);
    const estoqueResponse = await fetch(`${apiUrl}/estoques/${sapatoId}`);
    const estoqueDados = await estoqueResponse.json();
    setEstoques(estoqueDados);
  }
  
  useEffect(() => {
    fetchDados();
  }, [sapatoId]);
  
  async function adicionaEstoque(data: FormInputs) {
    const response = await fetch(`${apiUrl}/estoques`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        sapatoId: Number(sapatoId),
        preco: Number(data.preco),
        quantidade: Number(data.quantidade)
      })
    });
    
    if (response.ok) {
      toast.success("Item de estoque adicionado com sucesso!");
      reset();
      fetchDados();
    } else {
      toast.error("Erro ao adicionar item de estoque.");
    }
  }

  return (
    <div className="m-4 mt-24">
      <h1 className="text-3xl font-bold mb-4">
        Controle de Estoque: <span className="text-blue-600">{sapato?.modelo || 'Carregando...'}</span>
      </h1>
      <div className="p-6 mb-8 bg-white rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-4">Adicionar Novo Item ao Estoque</h2>
        <form onSubmit={handleSubmit(adicionaEstoque)} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input type="text" placeholder="Tamanho (ex: T_40)" {...register("tamanho")} className="input-estilo" required />
          <input type="text" placeholder="Cor (ex: BRANCO)" {...register("cor")} className="input-estilo" required />
          <input type="number" step="0.01" placeholder="Preço" {...register("preco")} className="input-estilo" required />
          <input type="number" placeholder="Quantidade" {...register("quantidade")} className="input-estilo" required />
          <button type="submit" className="bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Adicionar</button>
        </form>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Tamanho</th>
              <th scope="col" className="px-6 py-3">Cor</th>
              <th scope="col" className="px-6 py-3">Preço R$</th>
              <th scope="col" className="px-6 py-3">Quantidade</th>
              <th scope="col" className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {estoques.map(estoque => (
              <ItemEstoque key={estoque.id} estoque={estoque} onUpdate={fetchDados} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}