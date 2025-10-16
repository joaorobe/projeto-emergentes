
import './MinhasPropostas.css'
import { useEffect, useState } from "react";
import { useClienteStore } from "./context/ClienteContext";
import type { PropostaType } from "./utils/PropostaType";

const apiUrl = import.meta.env.VITE_API_URL

export default function Propostas() {
    const [propostas, setPropostas] = useState<PropostaType[]>([])
    const { cliente } = useClienteStore()

    useEffect(() => {
        async function buscaDados() {
            if (!cliente) {
                return;
            }
            const response = await fetch(`${apiUrl}/propostas/${cliente.id}`)
            const dados = await response.json()
            setPropostas(dados)
        }
        buscaDados()
    }, [cliente])
    function dataDMA(data: string) {
        const ano = data.substring(0, 4)
        const mes = data.substring(5, 7)
        const dia = data.substring(8, 10)
        return dia + "/" + mes + "/" + ano
    }

    const propostasTable = propostas.map(proposta => (
        <tr key={proposta.id} className="bg-white border-b dark:bg-black dark:border-gray">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <p><b>{proposta.sapato.marca.nome} {proposta.sapato.modelo}</b></p>
                <p className='mt-3'>
                    R$: {Number(proposta.sapato.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}</p>
            </th>
            <td className="px-6 py-4">
                <img src={proposta.sapato.foto} className="fotoSapato" alt="Foto Sapato" />
            </td>
            <td className="px-6 py-4">
                <p><b>{proposta.descricao}</b></p>
                <p><i>Enviado em: {dataDMA(proposta.createdAt)}</i></p>
            </td>
            <td className="px-6 py-4">
                {proposta.resposta ?
                    <>
                        <p><b>{proposta.resposta}</b></p>
                        <p><i>Respondido em: {dataDMA(proposta.updatedAt as string)}</i></p>
                    </>
                    :
                    <i>Aguardando...</i>}
            </td>
        </tr>
    ))


    return (
        <section className="max-w-7xl mx-auto">
            <h1 className="mb-6 mt-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-black">
                Listagem de <span className="">Minhas Reservas</span></h1>

            {propostas.length == 0 ?
                <h2 className="mb-4 mt-10 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-black">
                   &nbsp;&nbsp; Ah... Você ainda não fez Reserva para os nossos sapatos.
                </h2>
                :
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-black border-b dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Sapato
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Foto
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Reserva
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Resposta
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {propostasTable}
                    </tbody>
                </table>
            }
        </section>
    )
}