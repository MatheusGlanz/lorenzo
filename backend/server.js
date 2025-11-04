// backend/server.js
import express from 'express'
import cors from 'cors'
import { pool } from './db.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor do Chá de Fraldas do Lorenzo está rodando 🎉')
})

// Rota para salvar a confirmação
app.post('/api/confirmar', async (req, res) => {
  try {
    const { nome, confirmado, adultos, criancas } = req.body

    if (!nome || confirmado === undefined) {
      return res.status(400).json({ error: 'Dados incompletos' })
    }

    await pool.query(
      'INSERT INTO confirmacoes (nome, confirmado, adultos, criancas) VALUES ($1, $2, $3, $4)',
      [nome, confirmado === 'sim', adultos, criancas]
    )

    res.status(201).json({ message: 'Confirmação registrada com sucesso!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao salvar no banco' })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`))
