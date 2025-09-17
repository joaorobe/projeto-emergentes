// src/App.tsx

import { CardSapato } from "./components/CardSapato";
import { DestaqueItem } from "./components/DestaqueItem";
import { InputPesquisa } from "./components/InputPesquisa";
import type { SapatoType } from "./utils/SapatoType";
import { useEffect, useState, useRef } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

export default function App() {
  // --- ESTADOS DO COMPONENTE ---
  const [sapatosDestaque, setSapatosDestaque] = useState<SapatoType[]>([]);
  const [outrosSapatos, setOutrosSapatos] = useState<SapatoType[]>([]);
  const [resultadosPesquisa, setResultadosPesquisa] = useState<SapatoType[]>([]);
  const [estaPesquisando, setEstaPesquisando] = useState(false);

  // Referência para o container de rolagem do carrossel
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- EFEITOS ---
  // Busca os dados iniciais e separa em "destaques" e "outros"
  useEffect(() => {
    async function buscaDadosIniciais() {
      // Endpoint que busca TODOS os sapatos
      const response = await fetch(`${apiUrl}/sapatos`); 
      const dados = await response.json();

      if (Array.isArray(dados)) {
        // Filtra os sapatos em duas listas separadas com base na flag 'destaque'
        const destaques = dados.filter(sapato => sapato.destaque);
        const outros = dados.filter(sapato => !sapato.destaque);
        
        setSapatosDestaque(destaques);
        setOutrosSapatos(outros);
      }
    }
    buscaDadosIniciais();
  }, []);
  
  // --- FUNÇÕES DE CONTROLE ---
  // Funções para controlar a rolagem do carrossel
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 200;
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 200;
    }
  };

  // --- MAPEAMENTO DOS DADOS PARA COMPONENTES ---
  const listaDestaques = sapatosDestaque.map((sapato) => (
    <div key={sapato.id} className="flex-shrink-0">
      <DestaqueItem data={sapato} />
    </div>
  ));

  const listaOutrosSapatos = outrosSapatos.map((sapato) => (
    <CardSapato data={sapato} key={sapato.id} />
  ));
  
  const listaResultadosPesquisa = resultadosPesquisa.map((sapato) => (
    <CardSapato data={sapato} key={sapato.id} />
  ));

  // --- RENDERIZAÇÃO DO COMPONENTE ---
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl">
          Nossos <span className="text-gray-600">Sapatos</span>
        </h1>
        <InputPesquisa 
          setResultados={setResultadosPesquisa} 
          setEstaPesquisando={setEstaPesquisando} 
        />
      </header>
      
      {estaPesquisando ? (
        <section>
          <h2 className="text-2xl font-bold tracking-tight text-black mb-6">Resultados da Pesquisa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {listaResultadosPesquisa.length > 0 ? listaResultadosPesquisa : <p>Nenhum resultado encontrado.</p>}
          </div>
        </section>
      ) : (
        <>
          {/* Seção de Destaques com Carrossel */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-black text-center mb-6">Destaques</h2>
            
            <div className="relative max-w-6xl mx-auto px-12">
              
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-hidden space-x-8 pb-4 scroll-smooth"
              >
                {listaDestaques}
              </div>

              {/* Botão Esquerdo */}
              <button 
                onClick={scrollLeft} 
                className="absolute top-[4rem] left-0 transform -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-2 z-10 shadow-lg border border-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              
              {/* Botão Direito */}
              <button 
                onClick={scrollRight} 
                className="absolute top-[4rem] right-0 transform -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-2 z-10 shadow-lg border border-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </section>

          {/* Seção de Outros Sapatos */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-black mb-6">Outros Modelos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {listaOutrosSapatos}
            </div>
          </section>
        </>
      )}
    </main>
  );
}