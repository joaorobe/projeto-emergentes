import { Cores, Tamanhos, PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

import { verificaToken } from '../middewares/verificaToken'

const prisma = new PrismaClient()

const router = Router()

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
        estoques: true
      },
      orderBy: {
        id: 'desc'
      }
    })
    res.status(200).json(sapatos)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const sapato = await prisma.sapato.findFirst({
      where: { id: Number(id)},
      include: { // Only if 'ativo' is a valid relation
        marca: true,
        estoques: true,
      }
    })
    res.status(200).json(sapato)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.post("/", async (req, res) => {

  const valida = sapatoSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { modelo, preco, foto, tamanho, cor, destaque, marcaId } = valida.data


  try {
    const sapato = await prisma.sapato.create({
      data: { modelo, preco, foto, tamanho, cor, destaque, marcaId }
    })
    res.status(201).json(sapato)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.delete("/:id", verificaToken, async (req, res) => {
  const { id } = req.params

  try {
    // const sapato = await prisma.sapato.delete({
    //   where: { id: Number(id) }
    // })
    const sapato = await prisma.sapato.update({
      where: { id: Number(id) },
      data: { ativo: false }
    })

    // adminId vem do verificaToken (que acrescenta quando o usuário faz login)
    const adminId = req.userLogadoId as string
    const adminNome = req.userLogadoNome as string

    const descricao = `Exclusão de: ${sapato.modelo}`
    const complemento = `Admin: ${adminNome}`

    // registra um log de exclusão de sapato
    const log = await prisma.log.create({
      data: { descricao, complemento, adminId }
    })    

    res.status(200).json(sapato)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.put("/:id", async (req, res) => {
  const { id } = req.params

  const valida = sapatoSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { modelo, preco, foto, tamanho, cor, destaque, marcaId } = valida.data


  try {
    const sapato = await prisma.sapato.update({
      where: { id: Number(id) },
      data: { modelo, preco, foto, tamanho, cor, destaque, marcaId }
    })
    res.status(200).json(sapato)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.get("/pesquisa/:termo", async (req, res) => {
  const { termo } = req.params;

  const termoNumero = Number(termo);

  // Se o termo NÃO for um número, pesquisa por texto
  if (isNaN(termoNumero)) {
    try {
      const sapatos = await prisma.sapato.findMany({
        include: {
          marca: true,
          estoques: true, // ADICIONADO: Inclui os dados de estoque
        },
        where: {
          OR: [
            { modelo: { contains: termo, mode: "insensitive" } },
            { marca: { nome: { contains: termo, mode: "insensitive" } } },
          ],
        },
      });
      res.status(200).json(sapatos);
    } catch (error) {
      res.status(500).json({ erro: error });
    }
  } else {
    // Se o termo FOR um número, pesquisa por preço no estoque
    try {
      const sapatos = await prisma.sapato.findMany({
        include: {
          marca: true,
          estoques: true, // ADICIONADO: Inclui os dados de estoque
        },
        // CORRIGIDO: Busca por preço dentro do modelo relacionado 'Estoque'
        where: {
          estoques: {
            some: {
              preco: {
                lte: termoNumero,
              },
            },
          },
        },
      });
      res.status(200).json(sapatos);
    } catch (error) {
      res.status(500).json({ erro: error });
    }
  }
})

export default router
