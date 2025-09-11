// src/components/InputPesquisa.tsx

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { SapatoType } from "../utils/SapatoType";

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
    termo: string
}

type InputPesquisaProps = {
    setSapatos: React.Dispatch<React.SetStateAction<SapatoType[]>>
}

export function InputPesquisa({ setSapatos }: InputPesquisaProps) {
    const { register, handleSubmit, reset } = useForm<Inputs>()

    async function enviaPesquisa(data: Inputs) {
        if (data.termo.length < 2) {
            toast.error("Informe, no mínimo, 2 caracteres")
            return
        }

        const response = await fetch(`${apiUrl}/sapatos/pesquisa/${data.termo}`)
        const dados = await response.json()
        setSapatos(dados)
    }

    async function mostraDestaques() {
        const response = await fetch(`${apiUrl}/sapatos`)
        const dados = await response.json()
        reset({ termo: "" })
        setSapatos(dados)
    }

    return (
    <div className="flex w-full max-w-lg items-center gap-3">
        <form className="flex flex-grow items-center" onSubmit={handleSubmit(enviaPesquisa)}>
            <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-4 w-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <input
                    type="search"
                    id="default-search"
                    className="
                      block w-full rounded-md border-gray-300 bg-gray-50 p-3 pl-10 text-sm text-black 
                      shadow-sm focus:border-blue-500 focus:ring-blue-500
                      dark:border-gray-600 dark:bg-white dark:text-black dark:placeholder-gray-500
                    "
                    placeholder="Informe modelo ou marca"
                    required
                    {...register('termo')}
                />
            </div>
        </form>
        <button
            type="button"
            onClick={mostraDestaques}
            className="
              rounded-md bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm 
              transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 
              focus:ring-gray-400 focus:ring-offset-2
            "
        >
            Destaques
        </button>
    </div>
)
}