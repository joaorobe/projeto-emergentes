
import { Link } from "react-router-dom"
import type { SapatoType } from "../utils/SapatoType"
import { useState } from "react"

export function CardSapato({data}: {data: SapatoType}) {
    const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string | null>(null);

    const semEstoque = !data.estoques || data.estoques.length === 0;
    const precoInicial = semEstoque ? 0 : data.estoques[0].preco;

    return (
        <Link to={`/detalhes/${data.id}`} className="">
        <div className="group relative overflow-hidden bg-white text-center transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
     
            <img className="mx-auto h-80" src={data.foto} alt="Foto do Sapato" />
            
            <div className="p-4">
                <h5 className="mb-1 text-lg font-bold tracking-tight text-gray-900">
                    {data.marca.nome} {data.modelo} {data.cor}
                </h5>

                {semEstoque ? (
                    <p className="mb-3 font-bold text-red-600">
                        Produto Indisponível
                    </p>
                ) : (
                    <>
                        <p className="mb-3 font-semibold text-gray-700">
                            R$ {Number(precoInicial).toLocaleString("pt-br", {
                                minimumFractionDigits: 2
                            })}
                        </p>

                        <div className="mb-3 flex justify-center items-center gap-2">
                            {data.estoques.map(estoque => (
                                <button
                                    key={estoque.id}
                                    onClick={() => setTamanhoSelecionado(estoque.tamanho)}
                                    disabled={estoque.quantidade === 0}
                                    className={`
                                        border-2 rounded-md w-10 h-10 font-bold
                                        ${tamanhoSelecionado === estoque.tamanho ? 'border-black' : 'border-gray-300'}
                                        ${estoque.quantidade === 0 ? 'bg-gray-200 text-gray-400 line-through cursor-not-allowed' : 'hover:border-black'}
                                    `}
                                >
                                    {estoque.tamanho.split('_')[1]}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
        </Link>
    )
}