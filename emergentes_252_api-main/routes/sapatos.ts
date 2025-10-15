import { Cores, Tamanhos, PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

import { verificaToken } from '../middewares/verificaToken'

const prisma = new PrismaClient()

const router = Router()

// ===================================================================================
// FUNÇÃO AUXILIAR PARA CALCULAR O ESTOQUE TOTAL
// Esta função recebe um sapato com seus estoques e retorna com o campo 'quantidade_total'
// ===================================================================================
const transformarSapato = (sapatoComEstoque: any) => {
  if (!sapatoComEstoque || !sapatoComEstoque.estoques) {
    return sapatoComEstoque;
  }

  const quantidade_total = sapatoComEstoque.estoques.reduce((soma: number, estoque: { quantidade: number }) => {
    return soma + estoque.quantidade;
  }, 0);

  const { estoques, ...restoDoSapato } = sapatoComEstoque;

  return {
    ...restoDoSapato,
    quantidade_total,
  };
};

const sapatoSchema = z.object({
  modelo: z.string().min(2, { message: "Modelo deve possuir, no mínimo, 2 caracteres" }),
  preco: z.number(),
  foto: z.string().url({ message: "URL da foto inválida" }),
  tamanho: z.nativeEnum(Tamanhos).optional(),
  cor: z.nativeEnum(Cores).optional(),
  destaque: z.boolean().optional(),
  marcaId: z.number(),
})

router.get("/", async (req, res) => {
  try {
    const sapatos = await prisma.sapato.findMany({
      where: {
        ativo: true,
      },
      include: {
        marca: true,
        estoques: true,
      },
      orderBy: {
        id: 'desc'
      }
    })

    // Transforma cada sapato da lista para incluir a quantidade total
    const sapatosTransformados = sapatos.map(transformarSapato);

    res.status(200).json(sapatosTransformados);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const sapato = await prisma.sapato.findFirst({
      where: { id: Number(id) },
      include: {
        marca: true,
        estoques: true,
      }
    });

    if (!sapato) {
      res.status(404).json({ erro: "Sapato não encontrado" });
      return;
    }

    // Transforma o sapato encontrado para incluir a quantidade total
    const sapatoTransformado = transformarSapato(sapato);

    res.status(200).json(sapatoTransformado);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
})

router.post("/", async (req, res) => {
  const valida = sapatoSchema.safeParse(req.body);
  if (!valida.success) {
    res.status(400).json({ erro: valida.error });
    return;
  }

  const { modelo, preco, foto, tamanho, cor, destaque, marcaId } = valida.data;

  try {
    const sapato = await prisma.sapato.create({
      data: { modelo, preco, foto, tamanho, cor, destaque, marcaId }
    });
    res.status(201).json(sapato);
  } catch (error) {
    res.status(400).json({ error });
  }
})

router.delete("/:id", verificaToken, async (req, res) => {
  const { id } = req.params;

  try {
    const sapato = await prisma.sapato.update({
      where: { id: Number(id) },
      data: { ativo: false }
    });

    const adminId = req.userLogadoId as string;
    const adminNome = req.userLogadoNome as string;

    const descricao = `Exclusão de: ${sapato.modelo}`;
    const complemento = `Admin: ${adminNome}`;

    await prisma.log.create({
      data: { descricao, complemento, adminId }
    });

    res.status(200).json(sapato);
  } catch (error) {
    res.status(400).json({ erro: error });
  }
})

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const valida = sapatoSchema.safeParse(req.body);
  if (!valida.success) {
    res.status(400).json({ erro: valida.error });
    return;
  }

  const { modelo, preco, foto, tamanho, cor, destaque, marcaId } = valida.data;

  try {
    const sapato = await prisma.sapato.update({
      where: { id: Number(id) },
      data: { modelo, preco, foto, tamanho, cor, destaque, marcaId }
    });
    res.status(200).json(sapato);
  } catch (error) {
    res.status(400).json({ error });
  }
})

router.get("/pesquisa/:termo", async (req, res) => {
  const { termo } = req.params;
  const termoNumero = Number(termo);

  try {
    let sapatos;
    if (isNaN(termoNumero)) {
      // Se NÃO for um número, pesquisa por texto
      sapatos = await prisma.sapato.findMany({
        include: {
          marca: true,
          estoques: true,
        },
        where: {
          ativo: true,
          OR: [
            { modelo: { contains: termo, mode: "insensitive" } },
            { marca: { nome: { contains: termo, mode: "insensitive" } } },
          ],
        },
      });
    } else {
      // Se FOR um número, pesquisa por preço no estoque
      sapatos = await prisma.sapato.findMany({
        include: {
          marca: true,
          estoques: true,
        },
        where: {
          ativo: true,
          estoques: {
            some: {
              preco: {
                lte: termoNumero,
              },
            },
          },
        },
      });
    }

    // Transforma todos os resultados da busca para incluir a quantidade total
    const sapatosTransformados = sapatos.map(transformarSapato);

    res.status(200).json(sapatosTransformados);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

export default router;