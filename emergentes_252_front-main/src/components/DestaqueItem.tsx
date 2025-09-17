// src/components/DestaqueItem.tsx

import { Link } from "react-router-dom";
import type { SapatoType } from "../utils/SapatoType";

export function DestaqueItem({ data }: { data: SapatoType }) {
  return (
    <Link 
      to={`/detalhes/${data.id}`} 
      className="flex flex-col items-center gap-2 text-center group"
    >
      {/* A altura h-32 (8rem) é a referência para o alinhamento vertical dos botões */}
      <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
        <img 
          src={data.foto} 
          alt={data.modelo} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      
      <div className="w-32">
        <p className="text-sm font-semibold text-gray-800 truncate group-hover:underline">
          {data.modelo}
        </p>
      </div>
    </Link>
  );
}