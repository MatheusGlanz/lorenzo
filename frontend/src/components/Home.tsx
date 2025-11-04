import React, { useState } from 'react'

export function Home(): JSX.Element {
  const [status, setStatus] = useState<string>('')

  // 🔹 Detecta automaticamente se está em produção (Render) ou local
  const API_URL =
    import.meta.env.VITE_API_URL ||
    (window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'https://lorenzo-backend.onrender.com')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('Enviando...')

    const form = e.currentTarget
    const formData = new FormData(form)

    const data = {
      nome: String(formData.get('nome') || '').trim(),
      confirmado: String(formData.get('confirmado') || ''),
      adultos: Number(formData.get('adultos') || 0),
      criancas: Number(formData.get('criancas') || 0),
    }

    if (!data.nome || !['sim', 'nao'].includes(data.confirmado)) {
      setStatus('⚠️ Por favor, preencha seu nome e escolha se irá comparecer.')
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/confirmar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (res.ok) {
        setStatus('🎉 Confirmação enviada com sucesso! Obrigado 💙')
        form.reset()
      } else {
        setStatus(`❌ Erro: ${json.error || 'Resposta inválida do servidor.'}`)
      }
    } catch (err) {
      console.error(err)
      setStatus('❌ Erro ao conectar com o servidor. Tente novamente em instantes.')
    }
  }

  return (
    <div className="container">
      <header>
        <h1>Chá de Fraldas do Lorenzo</h1>
        <p>
          Estamos muito felizes em compartilhar esse momento com você.
          <br />
          Por favor, confirme sua presença até o dia <strong>10/01/2026</strong>.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <h2>Confirme sua Presença</h2>

        <div className="dados">
          <label htmlFor="nome">Seu nome:</label>
          <input type="text" id="nome" name="nome" required />
        </div>

        <div className="opcoes">
          <label>Você poderá comparecer?</label>
          <div>
            <input
              type="radio"
              id="confirmado-sim"
              name="confirmado"
              value="sim"
              required
            />
            <label htmlFor="confirmado-sim">Sim, estarei lá!</label>
          </div>
          <div>
            <input type="radio" id="confirmado-nao" name="confirmado" value="nao" />
            <label htmlFor="confirmado-nao">Não posso comparecer!</label>
          </div>
        </div>

        <div className="numero-pessoa">
          <label htmlFor="adultos">Nº de Adultos:</label>
          <input type="number" id="adultos" name="adultos" min={0} defaultValue={0} required />

          <label htmlFor="criancas">Nº de Crianças:</label>
          <input type="number" id="criancas" name="criancas" min={0} defaultValue={0} required />
        </div>

        <button type="submit">Enviar Confirmação</button>

        <p id="status" aria-live="polite" style={{ marginTop: '0.75rem' }}>
          {status}
        </p>
      </form>
    </div>
  )
}

export default Home
