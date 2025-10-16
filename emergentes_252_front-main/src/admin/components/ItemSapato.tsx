
import { TiDeleteOutline } from "react-icons/ti";
import { FaRegStar } from "react-icons/fa";
import type { SapatoAdminType } from "../AdminSapatos";
import { useAdminStore } from "../../context/AdminContext"; 
import { Link } from 'react-router-dom';
import { FaBoxes } from 'react-icons/fa';

const apiUrl = import.meta.env.VITE_API_URL;

interface ItemSapatoProps {
  sapato: SapatoAdminType;
  sapatos: SapatoAdminType[];
  setSapatos: React.Dispatch<React.SetStateAction<SapatoAdminType[]>>;
}

export default function ItemSapato({ sapato, sapatos, setSapatos }: ItemSapatoProps) {
  const { admin } = useAdminStore();

  async function excluirSapato() {
    if (!admin) {
      alert("Erro de autenticação.");
      return;
    }

    if (confirm(`Confirma a exclusão do modelo ${sapato.modelo}?`)) {
      try {
        const response = await fetch(`${apiUrl}/Sapatos/${sapato.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${admin.token}`
          }
        });

        if (response.ok) {
          const novosSapatos = sapatos.filter(s => s.id !== sapato.id);
          setSapatos(novosSapatos);
          alert("Sapato excluído com sucesso!");
        } else {
          alert("Erro ao excluir o sapato. Tente novamente.");
        }
      } catch (error) {
        console.error("Falha na requisição de exclusão:", error);
        alert("Erro de conexão ao tentar excluir o sapato.");
      }
    }
  }
  
  async function alterarDestaque() {
    console.log("Funcionalidade de destacar ainda não implementada.");
  }

  return (
    <tr className="bg-white border-b hover:bg-gray-50">
      <td className="p-4">
        <img src={sapato.foto} alt={`Foto do ${sapato.modelo}`} className="w-24 max-w-full h-auto" />
      </td>
      <td className={`px-6 py-4 font-medium ${sapato.destaque ? "font-extrabold text-blue-600" : "text-gray-900"}`}>
        {sapato.modelo}
      </td>
      <td className="px-6 py-4">
        {sapato.marca.nome}
      </td>
      <td className="px-6 py-4">
        {Number(sapato.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
      </td>
      <td className="px-6 py-4 font-bold">
        {sapato.quantidade_total}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <button onClick={excluirSapato} title="Excluir">
            <TiDeleteOutline className="text-2xl text-red-600 cursor-pointer" />
          </button>
          <button onClick={alterarDestaque} title="Destacar">
            <FaRegStar className="text-xl text-yellow-500 cursor-pointer" />
          </button>
          <Link to={`/admin/sapatos/estoque/${sapato.id}`} title="Gerenciar Estoque" className="text-blue-600 hover:text-blue-800">
            <FaBoxes className="text-xl" />
          </Link>
        </div>
      </td>
    </tr>
  );
}