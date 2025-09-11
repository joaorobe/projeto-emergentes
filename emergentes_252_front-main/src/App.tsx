// src/App.tsx

import { CardSapato } from "./components/CardSapato";
import { InputPesquisa } from "./components/InputPesquisa";
import type { SapatoType } from "./utils/SapatoType";
import { useEffect, useState } from "react";
import { useClienteStore } from "./context/ClienteContext";

const apiUrl = import.meta.env.VITE_API_URL;

export default function App() {
  const [sapatos, setSapatos] = useState<SapatoType[]>([]);
  const { logaCliente } = useClienteStore();

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${apiUrl}/sapatos`);
      const dados = await response.json();
      setSapatos(dados);
    }
    buscaDados();

    async function buscaCliente(id: string) {
      const response = await fetch(`${apiUrl}/clientes/${id}`);
      const dados = await response.json();
      logaCliente(dados);
    }
    if (localStorage.getItem("clienteKey")) {
      const idCliente = localStorage.getItem("clienteKey") as string;
      buscaCliente(idCliente);
    }
  }, []);

  const listaSapatos = sapatos.map((sapato) => (
    <CardSapato data={sapato} key={sapato.id} />
  ));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-black dark:black md:text-4xl">
          Sapatos <span className="text-black">em Destaque</span>
        </h1>
        <InputPesquisa setSapatos={setSapatos} />
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {listaSapatos}
      </div>
    </main>
  );
}