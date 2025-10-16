
import { create } from 'zustand';

export type AdminType = {
  id: number;
  nome: string;
  nivel: number;
  token: string;
};

type AdminStore = {
  admin: AdminType | null;
  logaAdmin: (adminLogado: AdminType) => void;
  deslogaAdmin: () => void;
};

export const useAdminStore = create<AdminStore>((set) => ({
  admin: null,
  
  logaAdmin: (adminLogado) => set({ admin: adminLogado }),
  deslogaAdmin: () => set({ admin: null }),
}));