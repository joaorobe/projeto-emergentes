
import type { SapatoType } from "../utils/SapatoType";
import { Link } from "react-router-dom";

interface CardSapatoProps {
  data: SapatoType;
}

export function CardSapato({ data }: CardSapatoProps) {
  const precoFormatado = `R$ ${Number(data.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}`;

  return (
    <Link to={`/sapatos/${data.id}`} className="group relative block overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <img
        src={data.foto}
        alt={`Foto do ${data.modelo}`}
        className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <div className="relative bg-white p-6">
        <span className="whitespace-nowrap bg-gray-100 px-3 py-1.5 text-xs font-medium rounded-full">
          {data.marca.nome}
        </span>

        <h3 className="mt-4 text-lg font-medium text-gray-900">{data.modelo}</h3>
        
        <p className="mt-1.5 text-md text-gray-700">{precoFormatado}</p>

        <div className="mt-4 flex items-center justify-center rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800">
          Ver Detalhes
        </div>
      </div>
    </Link>
  );
}