import type { MarcaType } from "./MarcaType"
import type { EstoqueType } from "./EstoqueType"

export type SapatoType = {
    id: number
    modelo: string
    preco: number
    destaque: boolean
    foto: string
    tamanho: string
    cor: string
    createdAt: Date
    updatedAt: Date
    marcaId: number
    marca: MarcaType
    estoques: EstoqueType[]
}