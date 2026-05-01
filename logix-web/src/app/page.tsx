'use client'

import { useEffect, useState } from 'react'

// --- Ícones Inline SVG ---
const Icons = {
  Truck: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="12" cy="7" r="4"/></svg>,
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="12" cy="10" r="3"/></svg>,
  Wrench: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"></svg>,
  Fuel: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"></svg>,
  Plus: () => <span>+</span>,
  Edit: () => <span>E</span>,
  Trash: () => <span>X</span>,
}

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

  // ✅ CORREÇÃO AQUI
  const tabLabelsSingular: Record<TabType, string> = {
    frota: 'Veículo',
    motoristas: 'Motorista',
    viagens: 'Viagem',
    manutencao: 'Serviço',
    combustivel: 'Abastecimento'
  }

  // --- LOCAL STORAGE ---
  useEffect(() => {
    const v = localStorage.getItem('veiculos')
    const m = localStorage.getItem('motoristas')
    const vi = localStorage.getItem('viagens')
    const ma = localStorage.getItem('manutencoes')
    const ab = localStorage.getItem('abastecimentos')

    if (v) setVeiculos(JSON.parse(v))
    if (m) setMotoristas(JSON.parse(m))
    if (vi) setViagens(JSON.parse(vi))
    if (ma) setManutencoes(JSON.parse(ma))
    if (ab) setAbastecimentos(JSON.parse(ab))
  }, [])

  useEffect(() => {
    localStorage.setItem('veiculos', JSON.stringify(veiculos))
    localStorage.setItem('motoristas', JSON.stringify(motoristas))
    localStorage.setItem('viagens', JSON.stringify(viagens))
    localStorage.setItem('manutencoes', JSON.stringify(manutencoes))
    localStorage.setItem('abastecimentos', JSON.stringify(abastecimentos))
  }, [veiculos, motoristas, viagens, manutencoes, abastecimentos])

  const resetForm = () => {
    setFormData({})
    setEditingId(null)
    setIsFormOpen(false)
  }

  const openForm = () => {
    setEditingId(null)

    if (tab === 'frota') setFormData({ status: 'DISPONIVEL' })
    else if (tab === 'motoristas') setFormData({ status: 'ATIVO' })
    else setFormData({})

    setIsFormOpen(true)
  }

  const handleEdit = (item: any) => {
    setFormData(item)
    setEditingId(item.id)
    setIsFormOpen(true)
  }

  const handleDelete = (id: number) => {
    if (tab === 'frota') setVeiculos(veiculos.filter(v => v.id !== id))
    if (tab === 'motoristas') setMotoristas(motoristas.filter(v => v.id !== id))
    if (tab === 'viagens') setViagens(viagens.filter(v => v.id !== id))
    if (tab === 'manutencao') setManutencoes(manutencoes.filter(v => v.id !== id))
    if (tab === 'combustivel') setAbastecimentos(abastecimentos.filter(v => v.id !== id))
  }

  const updateList = (list: any[], setList: any) => {
    setList(list.map(item => item.id === editingId ? { ...item, ...formData } : item))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()

    if (editingId) {
      if (tab === 'frota') updateList(veiculos, setVeiculos)
      if (tab === 'motoristas') updateList(motoristas, setMotoristas)
      if (tab === 'viagens') updateList(viagens, setViagens)
      if (tab === 'manutencao') updateList(manutencoes, setManutencoes)
      if (tab === 'combustivel') updateList(abastecimentos, setAbastecimentos)
    } else {
      const novo = { ...formData, id: Date.now() }

      if (tab === 'frota') setVeiculos([novo, ...veiculos])
      if (tab === 'motoristas') setMotoristas([novo, ...motoristas])
      if (tab === 'viagens') setViagens([novo, ...viagens])
      if (tab === 'manutencao') setManutencoes([novo, ...manutencoes])
      if (tab === 'combustivel') setAbastecimentos([novo, ...abastecimentos])
    }

    resetForm()
  }

  return (
    <div className="p-6 text-white">

      <div className="flex gap-2 mb-6">
        {['frota','motoristas','viagens','manutencao','combustivel'].map(t => (
          <button key={t} onClick={() => setTab(t as TabType)}>
            {t}
          </button>
        ))}
      </div>

      {/* ✅ CORREÇÃO AQUI */}
      <button onClick={openForm}>
        + Novo {tabLabelsSingular[tab]}
      </button>

      <pre>{JSON.stringify({ veiculos, motoristas, viagens, manutencoes, abastecimentos }, null, 2)}</pre>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black p-10">
          <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 space-y-4">

            {/* ✅ CORREÇÃO AQUI */}
            <h2>
              {editingId ? '✏️ Editando' : '➕ Novo'} {tabLabelsSingular[tab]}
            </h2>

            {tab === 'frota' && (
              <>
                <input placeholder="Placa" value={formData.placa || ''} onChange={e => setFormData({...formData, placa: e.target.value})}/>
                <input placeholder="Modelo" value={formData.modelo || ''} onChange={e => setFormData({...formData, modelo: e.target.value})}/>
                <input type="number" placeholder="KM" value={formData.km_atual || ''} onChange={e => setFormData({...formData, km_atual: e.target.value})}/>
              </>
            )}

            {tab === 'motoristas' && (
              <>
                <input placeholder="Nome" value={formData.nome || ''} onChange={e => setFormData({...formData, nome: e.target.value})}/>
                <input placeholder="CNH" value={formData.cnh || ''} onChange={e => setFormData({...formData, cnh: e.target.value})}/>
              </>
            )}

            {tab === 'viagens' && (
              <>
                <input placeholder="Origem" value={formData.origem || ''} onChange={e => setFormData({...formData, origem: e.target.value})}/>
                <input placeholder="Destino" value={formData.destino || ''} onChange={e => setFormData({...formData, destino: e.target.value})}/>
              </>
            )}

            <button type="submit">Salvar</button>
            <button type="button" onClick={resetForm}>Fechar</button>

          </form>
        </div>
      )}
    </div>
  )
}
