// src/components/CardSapato.tsx

import { Link } from "react-router-dom";
import type { SapatoType } from "../utils/SapatoType";

export function CardSapato({ data }: { data: SapatoType }) {

  const semEstoque = !data.estoques || data.estoques.length === 0;
  const precoInicial = semEstoque ? 0 : data.estoques[0].preco;

  return (
    // O div principal não é mais um Link. A classe 'group' controla o hover.
    <div className="group relative overflow-hidden bg-white text-center transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
      <Link to={`/detalhes/${data.id}`}>
        <img
          className="mx-auto h-80 w-full object-cover"
          src={data.foto}
          alt={`Foto do ${data.modelo}`}
        />
      </Link>
      
      <div className="p-4">
        <h5 className="mb-1 text-lg font-bold tracking-tight text-gray-900 truncate">
          {data.marca.nome} {data.modelo}
        </h5>

        {/* Container com altura fixa para manter o layout consistente */}
        <div className="h-14 flex items-center justify-center">
          {semEstoque ? (
            <p className="font-bold text-red-600">
              Produto Indisponível
            </p>
          ) : (
            <p className="font-semibold text-gray-700">
              R$ {Number(precoInicial).toLocaleString("pt-br", {
                minimumFractionDigits: 2,
              })}
            </p>
          )}
        </div>
      </div>

      {!semEstoque && (
        <div className="absolute bottom-5 left-0 right-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Link 
            to={`/detalhes/${data.id}`} 
            className="inline-block bg-black text-white border border-black hover:bg-white hover:text-black font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200"
          >
            Ver Detalhes
          </Link>
        </div>
      )}
    </div>
  );
}