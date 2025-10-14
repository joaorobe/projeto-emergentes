// src/Detalhes.tsx

import type { SapatoType } from "./utils/SapatoType";
import type { EstoqueType } from "./utils/EstoqueType";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useClienteStore } from "./context/ClienteContext";
import { useForm } from "react-hook-form";
import { toast } from 'sonner';

const apiUrl = import.meta.env.VITE_API_URL;

type Inputs = {
  descricao: string;
};

export default function Detalhes() {
  const params = useParams();
  const [sapato, setSapato] = useState<SapatoType | null>(null);
  const [estoqueSelecionado, setEstoqueSelecionado] = useState<EstoqueType | null>(null);
  const { cliente } = useClienteStore();
  const { register, handleSubmit, reset } = useForm<Inputs>();

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${apiUrl}/sapatos/${params.sapatoId}`);
      const dados = await response.json();
      setSapato(dados);
      if (dados?.estoques && dados.estoques.length > 0) {
        setEstoqueSelecionado(dados.estoques[0]);
      }
    }
    buscaDados();
  }, [params.sapatoId]);

  async function enviaProposta(data: Inputs) {
    if (!estoqueSelecionado) {
      toast.error("Por favor, selecione um tamanho antes de fazer uma reserva.");
      return;
    }

    if (!cliente) {
      toast.error("Você precisa estar logado para fazer uma reserva.");
      return;
    }

    const response = await fetch(`${apiUrl}/propostas`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        clienteId: cliente.id,
        sapatoId: Number(params.sapatoId),
        descricao: `Tamanho: ${estoqueSelecionado.tamanho.split('_')[1]}. Reserva: ${data.descricao}`
      })
    });

    if (response.status === 201) {
      toast.success("Obrigado. Sua reserva foi registrada. Aguarde retorno");
      reset();
    } else {
      toast.error("Erro... Não foi possível concluir sua reserva.");
    }
  }

  if (!sapato) {
    return <p className="text-center mt-10 text-xl">Carregando detalhes do produto...</p>;
  }

  return (
    <section className="flex mt-6 mx-auto flex-col items-center bg-white md:flex-row md:max-w-5xl">
      <img className="object-cover w-full md:w-1/2"
        src={sapato.foto} alt="Foto do Sapato" />

      <div className="flex flex-col justify-between p-8 leading-normal md:w-1/2">
        <h5 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
          {sapato.marca.nome} {sapato.modelo} {sapato.cor}
        </h5>

        <h5 className="mb-4 text-2xl font-semibold tracking-tight text-gray-800">
          R$ {Number(estoqueSelecionado?.preco || 0).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
        </h5>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-900">Selecione seu Tamanho:</label>
          <div className="flex flex-wrap gap-2">
            {sapato?.estoques?.map(estoque => (
              <button
                key={estoque.id}
                onClick={() => setEstoqueSelecionado(estoque)}
                disabled={estoque.quantidade === 0}
                className={`
                  border-2 rounded-md w-12 h-12 font-bold transition-colors
                  ${estoqueSelecionado?.id === estoque.id ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-800'}
                  ${estoque.quantidade === 0 ? 'bg-gray-200 text-gray-400 line-through cursor-not-allowed' : 'hover:border-black'}
                `}
              >
                {estoque.tamanho.split('_')[1]}
              </button>
            ))}
          </div>
        </div>

        {cliente ? (
          <>
            <h3 className="text-lg font-bold tracking-tight text-gray-900 mb-2">
              Faça sua Reserva:
            </h3>
            <form onSubmit={handleSubmit(enviaProposta)}>
              <textarea
                id="message"
                className="mb-4 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descreva a sua proposta de valor..."
                required
                {...register("descricao")}
              />
              <button
                type="submit"
                className="w-full bg-black text-white border border-black hover:bg-white hover:text-black font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-200">
                Enviar Proposta
              </button>
            </form>
          </>
        ) : (
          <h2 className="text-xl tracking-tight text-gray-800">
            😎 Gostou? <Link to="/login" className="font-bold underline">Faça login</Link> para fazer uma proposta!
          </h2>
        )}
      </div>
    </section>
  );
}