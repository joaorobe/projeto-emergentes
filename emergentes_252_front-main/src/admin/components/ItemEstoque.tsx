import { useState } from 'react';
import type { EstoqueType } from '../../utils/EstoqueType';
import { FaTrash, FaSave } from 'react-icons/fa';
import { toast } from 'sonner';

const apiUrl = import.meta.env.VITE_API_URL;

interface ItemEstoqueProps {
  estoque: EstoqueType;
  onUpdate: () => void;
}

export default function ItemEstoque({ estoque, onUpdate }: ItemEstoqueProps) {
  const [quantidade, setQuantidade] = useState(estoque.quantidade);

  async function handleUpdate() {
    const response = await fetch(`${apiUrl}/estoques/${estoque.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantidade: Number(quantidade) })
    });
    if (response.ok) {
      toast.success("Quantidade atualizada com sucesso!");
      onUpdate();
    } else {
      toast.error("Erro ao atualizar quantidade.");
    }
  }

  async function handleDelete() {
    if (confirm(`Deseja realmente excluir o estoque tamanho ${estoque.tamanho} - cor ${estoque.cor}?`)) {
      const response = await fetch(`${apiUrl}/estoques/${estoque.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast.success("Item de estoque excluído com sucesso!");
        onUpdate();
      } else {
        toast.error("Erro ao excluir item de estoque.");
      }
    }
  }

  return (
    <tr className="bg-white border-b hover:bg-gray-50">
      <td className="px-6 py-4">{estoque.tamanho.replace('T_', '')}</td>
      <td className="px-6 py-4">{estoque.cor}</td>
      <td className="px-6 py-4">{Number(estoque.preco).toLocaleString('pt-br', { minimumFractionDigits: 2 })}</td>
      <td className="px-6 py-4">
        <input 
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
          className="w-20 p-1 border border-gray-300 rounded-md"
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-4">
          <button onClick={handleUpdate} title="Salvar Quantidade" className="text-green-600 hover:text-green-800">
            <FaSave />
          </button>
          <button onClick={handleDelete} title="Excluir Item" className="text-red-600 hover:text-red-800">
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  );
}