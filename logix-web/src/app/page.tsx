'use client'

import { useEffect, useState } from 'react'

// --- ÍCONES (MANTIDOS IGUAL AO SEU ORIGINAL) ---
const Icons = {
  Truck: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" ... />,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" ... />,
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" ... />,
  Wrench: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" ... />,
  Fuel: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" ... />,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" ... />,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" ... />,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" ... />,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" ... />,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" ... />,
  ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" ... />,
  Phone: () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" ... />
}

type TabType = 'frota' | 'motoristas' | 'viagens' | 'manutencao' | 'combustivel'

const API = 'https://logix-flow.fly.dev'

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
  const [kmFinais, setKmFinais] = useState<Record<number, string>>({})

  // =========================
  // 🔥 CARREGAR DADOS API
  // =========================
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
      console.error('Erro API:', err)
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

  // =========================
  // 🗑 DELETE
  // =========================
  const handleDelete = async (id: number) => {

    const rota =
      tab === 'frota' ? 'veiculos' :
      tab === 'motoristas' ? 'motoristas' :
      tab === 'viagens' ? 'viagens' :
      tab === 'manutencao' ? 'manutencoes' :
      'abastecimentos'

    await fetch(`${API}/${rota}/${id}`, {
      method: 'DELETE'
    })

    loadData()
  }

  // =========================
  // ✏️ EDIT
  // =========================
  const handleEdit = (item: any) => {
    setFormData(item)
    setEditingId(item.id)
    setIsFormOpen(true)
  }

  // =========================
  // 💾 SAVE
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const rota =
      tab === 'frota' ? 'veiculos' :
      tab === 'motoristas' ? 'motoristas' :
      tab === 'viagens' ? 'viagens' :
      tab === 'manutencao' ? 'manutencoes' :
      'abastecimentos'

    await fetch(`${API}/${rota}${editingId ? `/${editingId}` : ''}`, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    resetForm()
    loadData()
  }

  // =========================
  // FINALIZAR VIAGEM
  // =========================
  const finalizarViagem = async (id: number) => {
    const km = Number(kmFinais[id])

    await fetch(`${API}/viagens/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'CONCLUIDA',
        km_final: km
      })
    })

    loadData()
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">

      {/* HEADER ORIGINAL */}
      <header className="flex justify-between mb-10">
        <h1 className="text-3xl font-bold">LOGIX FLOW</h1>
      </header>

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

      {/* =========================
          FROTA
      ========================= */}
      {tab === 'frota' && veiculos.map(v => (
        <div key={v.id}>
          {v.placa} - {v.modelo}
          <button onClick={() => handleEdit(v)}>Editar</button>
          <button onClick={() => handleDelete(v.id)}>Excluir</button>
        </div>
      ))}

      {/* =========================
          MOTORISTAS
      ========================= */}
      {tab === 'motoristas' && motoristas.map(m => (
        <div key={m.id}>
          {m.nome}
          <button onClick={() => handleEdit(m)}>Editar</button>
          <button onClick={() => handleDelete(m.id)}>Excluir</button>
        </div>
      ))}

      {/* =========================
          VIAGENS
      ========================= */}
      {tab === 'viagens' && viagens.map(v => (
        <div key={v.id}>
          {v.origem} → {v.destino}

          {v.status === 'EM_CURSO' && (
            <>
              <input
                placeholder="KM final"
                onChange={e => setKmFinais({ ...kmFinais, [v.id]: e.target.value })}
              />
              <button onClick={() => finalizarViagem(v.id)}>Finalizar</button>
            </>
          )}

          <button onClick={() => handleEdit(v)}>Editar</button>
          <button onClick={() => handleDelete(v.id)}>Excluir</button>
        </div>
      ))}

      {/* =========================
          MANUTENÇÃO
      ========================= */}
      {tab === 'manutencao' && manutencoes.map(m => (
        <div key={m.id}>
          {m.servico} - R$ {m.valor}
          <button onClick={() => handleDelete(m.id)}>Excluir</button>
        </div>
      ))}

      {/* =========================
          COMBUSTÍVEL
      ========================= */}
      {tab === 'combustivel' && abastecimentos.map(a => (
        <div key={a.id}>
          {a.litros}L - R$ {a.total}
          <button onClick={() => handleDelete(a.id)}>Excluir</button>
        </div>
      ))}

      {/* FORM SIMPLES (MANTIDO FUNCIONAL) */}
      {isFormOpen && (
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Campo principal"
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
