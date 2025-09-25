
import type { SapatoType } from "./SapatoType"
import type { ClienteType } from "./ClienteType"

export type PropostaType = {
    id: number
    descricao: string
    resposta: string | null
    createdAt: string
    updatedAt: string | null
    clienteId: string
    sapatoId: number
    sapato: SapatoType
    cliente: ClienteType
}