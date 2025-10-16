

import { useEffect, useState } from "react";
import ItemSapato from './components/ItemSapato';
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

export type SapatoAdminType = {
  id: number;
  modelo: string;
  marca: { 
    id: number;
    nome: string; 
  };
  preco: number;
  foto: string;
  destaque: boolean;
  quantidade_total: number;
}

export default function AdminSapatos() {
  const [sapatos, setSapatos] = useState<SapatoAdminType[]>([]);

  useEffect(() => {
    async function getSapatos() {
      const response = await fetch(`${apiUrl}/Sapatos/admin/lista`);
      const dados = await response.json();
      setSapatos(dados);
    }
    getSapatos();
  }, []);

  const listaSapatos = sapatos.map(sapato => (
    <ItemSapato 
      key={sapato.id} 
      sapato={sapato} 
      sapatos={sapatos} 
      setSapatos={setSapatos} 
    />
  ));

  return (
    <div className='m-4 mt-24'>
      <div className='flex justify-between items-center'>
        <h1 className="mb-4 text-2xl font-bold">
          Cadastro de Sapatos
        </h1>
        <Link to="/admin/sapatos/novo" 
          className="text-white bg-blue-700 hover:bg-blue-800 font-bold rounded-lg text-md px-5 py-2.5 h-fit">
          Novo Sapato
        </Link>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Foto</th>
              <th scope="col" className="px-6 py-3">Modelo do Sapato</th>
              <th scope="col" className="px-6 py-3">Marca</th>
              <th scope="col" className="px-6 py-3">Preço R$</th>
              <th scope="col" className="px-6 py-3">Qtd. em Estoque</th>
              <th scope="col" className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {listaSapatos}
          </tbody>
        </table>
      </div>
    </div>
  );
}