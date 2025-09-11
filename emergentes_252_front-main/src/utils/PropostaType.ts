
import type { SapatoType } from "./SapatoType"

export type PropostaType = {
    id: number
    descricao: string
    resposta: string | null
    createdAt: string
    updatedAt: string | null
    clienteId: string
    sapatoId: number
    sapato: SapatoType
}