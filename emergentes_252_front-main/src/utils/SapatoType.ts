
export type EstoqueType = {
  id: number;
  tamanho: string;
  cor: string;
  preco: number;
  quantidade: number;
};
export type SapatoType = {
  id: number;
  modelo: string;
  marca: {
    id: number;
    nome: string;
  };
  cor: string;
  preco: number;
  foto: string;
  destaque: boolean;
  estoques?: EstoqueType[];
};