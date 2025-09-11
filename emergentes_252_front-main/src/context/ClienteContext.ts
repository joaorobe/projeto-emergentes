

import type { ClienteType } from '../utils/ClienteType'
import { create } from 'zustand'

type ClienteStore = {
    cliente: ClienteType | null
    logaCliente: (clienteLogado: ClienteType) => void
    deslogaCliente: () => void
}

export const useClienteStore = create<ClienteStore>((set) => ({
    cliente: null,
    logaCliente: (clienteLogado) => set({ cliente: clienteLogado }),
    deslogaCliente: () => set({ cliente: null })
}))