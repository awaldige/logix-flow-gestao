'use client'

import { useEffect, useState } from 'react'

const API = 'https://logix-flow.fly.dev'

type TabType = 'frota' | 'motoristas' | 'viagens' | 'manutencao' | 'combustivel';

export default function App() {

  const [tab, setTab] = useState<TabType>('viagens')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [veiculos, setVeiculos] = useState<any[]>([])
  const [motoristas, setMotoristas] = useState<any[]>([])
  const [viagens, setViagens] = useState<any[]>([])
  const [manutencoes, setManutencoes] = useState<any[]>([])
  const [abastecimentos, setAbastecimentos] = useState<any[]>([])

  const [formData, setFormData] = useState<any>({})

  // ============================
  // 🔥 CARREGAR DO BACKEND
  // ============================
  const loadData = async () => {
    try {
      const [v, m, t, mn, ab] = await Promise.all([
        fetch(`${API}/veiculos`).then(r => r.json()),
        fetch(`${API}/motoristas`).then(r => r.json()),
        fetch(`${API}/viagens`).then(r => r.json()),
        fetch(`${API}/manutencoes`).then(r => r.json()),
        fetch(`${API}/abastecimentos`).then(r => r.json()),
      ])

      setVeiculos(v)
      setMotoristas(m)
      setViagens(t)
      setManutencoes(mn)
      setAbastecimentos(ab)

    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const resetForm = () => {
    setFormData({})
    setEditingId(null)
    setIsFormOpen(false)
  }

  // ============================
  // 🗑 DELETE
  // ============================
  const handleDelete = async (id: number) => {
    const rota =
      tab === 'frota' ? 'veiculos' :
      tab === 'motoristas' ? 'motoristas' :
      tab === 'viagens' ? 'viagens' :
      tab === 'manutencao' ? 'manutencoes' :
      'abastecimentos'

    await fetch(`${API}/${rota}/${id}`, { method: 'DELETE' })
    loadData()
  }

  // ============================
  // ✏️ EDITAR
  // ============================
  const handleEdit = (item: any) => {
    setFormData(item)
    setEditingId(item.id)
    setIsFormOpen(true)
  }

  // ============================
  // 💾 SALVAR
  // ============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const rota =
      tab === 'frota' ? 'veiculos' :
      tab === 'motoristas' ? 'motoristas' :
      tab === 'viagens' ? 'viagens' :
      tab === 'manutencao' ? 'manutencoes' :
      'abastecimentos'

    if (editingId) {
      await fetch(`${API}/${rota}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
    } else {
      await fetch(`${API}/${rota}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
    }

    resetForm()
    loadData()
  }

  return (
    <div className="p-6 text-white bg-black min-h-screen">

      <h1 className="text-3xl font-bold mb-6">LOGIX FLOW (ONLINE)</h1>

      {/* MENU */}
      <div className="flex gap-2 mb-6">
        {['frota','motoristas','viagens','manutencao','combustivel'].map(t => (
          <button key={t} onClick={() => setTab(t as TabType)}>
            {t}
          </button>
        ))}
      </div>

      <button onClick={() => setIsFormOpen(true)}>
        + Novo
      </button>

      {/* LISTA */}
      <div className="mt-6 space-y-4">

        {tab === 'frota' && veiculos.map(v => (
          <div key={v.id}>
            {v.placa} - {v.modelo}
            <button onClick={() => handleEdit(v)}>Editar</button>
            <button onClick={() => handleDelete(v.id)}>Excluir</button>
          </div>
        ))}

        {tab === 'motoristas' && motoristas.map(m => (
          <div key={m.id}>
            {m.nome}
            <button onClick={() => handleEdit(m)}>Editar</button>
            <button onClick={() => handleDelete(m.id)}>Excluir</button>
          </div>
        ))}

        {tab === 'viagens' && viagens.map(v => (
          <div key={v.id}>
            {v.origem} → {v.destino}
            <button onClick={() => handleEdit(v)}>Editar</button>
            <button onClick={() => handleDelete(v.id)}>Excluir</button>
          </div>
        ))}

        {tab === 'manutencao' && manutencoes.map(m => (
          <div key={m.id}>
            {m.servico} - R$ {m.valor}
            <button onClick={() => handleDelete(m.id)}>Excluir</button>
          </div>
        ))}

        {tab === 'combustivel' && abastecimentos.map(a => (
          <div key={a.id}>
            {a.litros}L - R$ {a.total}
            <button onClick={() => handleDelete(a.id)}>Excluir</button>
          </div>
        ))}

      </div>

      {/* FORM */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">

          <input
            placeholder="Nome / Placa / Serviço..."
            value={formData.nome || formData.placa || ''}
            onChange={e => setFormData({ ...formData, nome: e.target.value })}
          />

          <button type="submit">Salvar</button>
          <button onClick={resetForm}>Cancelar</button>

        </form>
      )}

    </div>
  )
}
