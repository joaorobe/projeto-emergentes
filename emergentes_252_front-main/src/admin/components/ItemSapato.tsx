import { TiDeleteOutline } from "react-icons/ti"
import { FaRegStar } from "react-icons/fa"

import type { SapatoType } from "../../utils/SapatoType"
import { useAdminStore } from "../context/AdminContext"

interface listaSapatoProps {
  Sapato: SapatoType;
  Sapatos: SapatoType[];
  setSapatos: React.Dispatch<React.SetStateAction<SapatoType[]>>;
}

const apiUrl = import.meta.env.VITE_API_URL

export default function ItemSapato({ Sapato, Sapatos, setSapatos }: listaSapatoProps) {
  const { admin } = useAdminStore()

  async function excluirSapato() {
    if (!admin || admin.nivel == 1) {
      alert("Você não tem permissão para excluir veículos");
      return;
    }

    if (confirm(`Confirma a exclusão`)) {
      const response = await fetch(`${apiUrl}/Sapatos/${Sapato.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${admin.token}`
          },
        },
      )

      if (response.status == 200) {
        const Sapatos2 = Sapatos.filter(x => x.id != Sapato.id)
        setSapatos(Sapatos2)
        alert("Sapato excluído com sucesso")
      } else {
        alert("Erro... Sapato não foi excluído")
      }
    }
  }

  async function alterarDestaque() {

    const response = await fetch(`${apiUrl}/Sapatos/destacar/${Sapato.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${admin.token}`
        },
      },
    )

    if (response.status == 200) {
      const Sapatos2 = Sapatos.map(x => {
        if (x.id == Sapato.id) {
          return { ...x, destaque: !x.destaque }
        }
        return x
      })
      setSapatos(Sapatos2)
    }
  }

  return (
    <tr key={Sapato.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <img src={Sapato.foto} alt={`Foto do ${Sapato.modelo}`}
          style={{ width: 200 }} />
      </th>
      <td className={`px-6 py-4 ${Sapato.destaque ? "font-extrabold" : ""}`}>
        {Sapato.modelo}
      </td>
      <td className={`px-6 py-4 ${Sapato.destaque ? "font-extrabold" : ""}`}>
        {Sapato.marca.nome}
      </td>
      <td className={`px-6 py-4 ${Sapato.destaque ? "font-extrabold" : ""}`}>
        {Sapato.cor}
      </td>
      <td className={`px-6 py-4 ${Sapato.destaque ? "font-extrabold" : ""}`}>
        {Number(Sapato.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
      </td>
      
      {/* ======================================================= */}
      {/* LINHA ATUALIZADA PARA MOSTRAR O ESTOQUE TOTAL           */}
      {/* ======================================================= */}
      <td className={`px-6 py-4 font-bold ${Sapato.destaque ? "font-extrabold" : ""}`}>
        {Sapato.quantidade_total}
      </td>
      
      <td className="px-6 py-4">
        <TiDeleteOutline className="text-3xl text-red-600 inline-block cursor-pointer" title="Excluir"
          onClick={excluirSapato} />&nbsp;
        <FaRegStar className="text-3xl text-yellow-600 inline-block cursor-pointer" title="Destacar"
          onClick={alterarDestaque} />
      </td>
    </tr>
  )
}