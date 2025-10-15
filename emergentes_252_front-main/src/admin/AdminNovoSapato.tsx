import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import type { MarcaType } from "../utils/MarcaType"
import { useAdminStore } from "./context/AdminContext"

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
  modelo: string
  marcaId: number
  cor: string
  tamanho: string
  preco: number
  foto: string
  quantidade: number
  estoque: number
  adminId: string  
}

export default function AdminNovoSapato() {
  const [marcas, setMarcas] = useState<MarcaType[]>([])
  const { admin } = useAdminStore()

  const {
    register,
    handleSubmit,
    reset,
    setFocus
  } = useForm<Inputs>()

  useEffect(() => {
    async function getMarcas() {
      const response = await fetch(`${apiUrl}/marcas`)
      const dados = await response.json()
      setMarcas(dados)
    }
    getMarcas()
    setFocus("modelo")
  }, [])

  const optionsMarca = marcas.map(marca => (
    <option key={marca.id} value={marca.id}>{marca.nome}</option>
  ))

  async function incluirSapato(data: Inputs) {

    const novoSapato: Inputs = {
      modelo: data.modelo,
      marcaId: Number(data.marcaId),
      cor: data.cor,
      tamanho: data.tamanho,
      foto: data.foto,
      preco: Number(data.preco),
      quantidade: Number(data.quantidade),
      estoque: Number(data.estoque),
      adminId: admin.id
    }

    const response = await fetch(`${apiUrl}/Sapatos`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
            Authorization: `Bearer ${admin.token}`
        },
        body: JSON.stringify(novoSapato)
      },
    )

    if (response.status == 201) {
      toast.success("Ok! Sapato cadastrado com sucesso")
      reset()
    } else {
      toast.error("Erro no cadastro do Sapato...")
    }
  }

  return (
    <>
      <h1 className="mb-4 mt-24 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-black me-56">
        Inclusão de Sapatos
      </h1>

      <form className="max-w-xl mx-auto" onSubmit={handleSubmit(incluirSapato)}>
        <div className="mb-3">
          <label htmlFor="modelo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
            Modelo do Sapato</label>
          <input type="text" id="modelo"
            className="bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" required
            {...register("modelo")}
          />
        </div>
        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <div className="mb-3">
            <label htmlFor="marcaId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
              Marca</label>
            <select id="marcaId"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" required
              {...register("marcaId")}
            >
              {optionsMarca}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="cor" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
              Cor</label>
            <select id="cor"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" required
              {...register("cor")}
            >
              <option>PRETO</option>
              <option>BRANCO</option>
              <option>MARROM</option>
              <option>VERMELHO</option>
              <option>CINZA</option>
              <option>AZUL</option>
            </select>
          </div>
        </div>
        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <div className="mb-3">
            <label htmlFor="preco" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
              Preço R$</label>
            <input type="number" id="preco"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" required
              {...register("preco")}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tamanho" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
              Tamanho</label>
            <select id="tamanho"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" required
              {...register("tamanho")}
            >
              <option>BR_36</option>
              <option>BR_37</option>
              <option>BR_38</option>
              <option>BR_39</option>
              <option>BR_40</option>
            </select>
          </div>
        </div>
        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <div className="mb-3">
            <label htmlFor="foto" className="block mb-2 text-sm font-medium text-gray-900 dark:black">
              URL da Foto</label>
            <input type="text" id="foto"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:black dark:focus:ring-blue-500 dark:focus:border-blue-500" required
              {...register("foto")}
            />
          </div>
          <div className="grid mb-3 md:grid-cols-2">
          <div className="mb-3">
            <label htmlFor="quantidade" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
              Quantidade</label>
            <input type="number" id="quantidade"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" required
              {...register("quantidade")}
            />
          </div>
          </div>
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Incluir</button>
      </form>
    </>
  )
}

