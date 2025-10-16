
import { useState, useEffect } from "react";
import type { SapatoType } from "../utils/SapatoType";
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_API_URL;
type InputPesquisaProps = {
    setResultados: React.Dispatch<React.SetStateAction<SapatoType[]>>;
    setEstaPesquisando: React.Dispatch<React.SetStateAction<boolean>>;
};

export function InputPesquisa({ setResultados, setEstaPesquisando }: InputPesquisaProps) {
    const [termo, setTermo] = useState('');

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (termo === '') {
                setEstaPesquisando(false);
                setResultados([]);
                return;
            }
            
            if (termo.length >= 2) {
                setEstaPesquisando(true);
                fetch(`${apiUrl}/sapatos/pesquisa/${termo}`)
                    .then(res => res.json())
                    .then(dados => {
                        if (Array.isArray(dados)) {
                            setResultados(dados);
                            if (dados.length === 0) {
                                toast.info("Nenhum sapato encontrado para esta pesquisa.");
                            }
                        } else {
                            setResultados([]);
                        }
                    });
            }
        }, 500);

        return () => clearTimeout(debounceTimer);

    }, [termo, setResultados, setEstaPesquisando]);

    return (
        <div className="w-full max-w-sm">
            <input
                type="search"
                className="block w-full rounded-md border-gray-300 bg-gray-50 p-3 text-sm text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Pesquise em nosso catálogo..."
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
            />
        </div>
    );
}