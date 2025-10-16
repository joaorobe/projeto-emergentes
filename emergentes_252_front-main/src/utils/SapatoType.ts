// src/utils/SapatoType.ts

// Tipo para os estoques, usado na página de detalhes
export type EstoqueType = {
  id: number;
  tamanho: string;
  cor: string;
  preco: number;
  quantidade: number;
};

// Tipo principal para o sapato, usado em todo o site do cliente
export type SapatoType = {
  id: number;
  modelo: string;
  marca: {
    id: number;
    nome: string;
  };
  // Campos simples para a vitrine
  cor: string;
  preco: number;
  foto: string;
  destaque: boolean;
  // O array de estoques é opcional, carregado apenas na página de detalhes
  estoques?: EstoqueType[];
};