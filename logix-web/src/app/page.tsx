'use client'

import { useEffect, useState } from 'react'

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

  // ✅ SAFE PARSE
  const safeParse = (key: string) => {
    try {
      const data = localStorage.getItem(key)
      if (!data) return []
      const parsed = JSON.parse(data)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      console.error('Erro ao ler:', key)
      return []
    }
  }

  // ✅ LOAD
  useEffect(() => {
    setVeiculos(safeParse('veiculos'))
    setMotoristas(safeParse('motoristas'))
    setViagens(safeParse('viagens'))
    setManutencoes(safeParse('manutencoes'))
    setAbastecimentos(safeParse('abastecimentos'))
  }, [])

  // ✅ SAVE PROTEGIDO
  useEffect(() => {
    try {
      localStorage.setItem('veiculos', JSON.stringify(veiculos))
      localStorage.setItem('motoristas', JSON.stringify(motoristas))
      localStorage.setItem('viagens', JSON.stringify(viagens))
      localStorage.setItem('manutencoes', JSON.stringify(manutencoes))
      localStorage.setItem('abastecimentos', JSON.stringify(abastecimentos))
    } catch {
      console.error('Erro ao salvar')
    }
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
    if (tab === 'frota') setVeiculos(prev => prev.filter(v => v.id !== id))
    if (tab === 'motoristas') setMotoristas(prev => prev.filter(v => v.id !== id))
    if (tab === 'viagens') setViagens(prev => prev.filter(v => v.id !== id))
    if (tab === 'manutencao') setManutencoes(prev => prev.filter(v => v.id !== id))
    if (tab === 'combustivel') setAbastecimentos(prev => prev.filter(v => v.id !== id))
  }

  // ✅ UPDATE COM MERGE (CORRIGIDO)
  const updateList = (list: any[], setList: any) => {
    setList(list.map(item =>
      item.id === editingId ? { ...item, ...formData } : item
    ))
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

      if (tab === 'frota') setVeiculos(prev => [novo, ...prev])
      if (tab === 'motoristas') setMotoristas(prev => [novo, ...prev])
      if (tab === 'viagens') setViagens(prev => [novo, ...prev])
      if (tab === 'manutencao') setManutencoes(prev => [novo, ...prev])
      if (tab === 'combustivel') setAbastecimentos(prev => [novo, ...prev])
    }

    resetForm()
  }

  return (
    <div className="p-6 text-white bg-black min-h-screen">

      {/* NAV */}
      <div className="flex gap-2 mb-6">
        {['frota','motoristas','viagens','manutencao','combustivel'].map(t => (
          <button key={t} onClick={() => setTab(t as TabType)}>
            {t}
          </button>
        ))}
      </div>

      {/* BOTÃO */}
      <button onClick={openForm}>+ Novo</button>

      {/* DEBUG */}
      <pre className="mt-6 text-xs">
        {JSON.stringify({ veiculos, motoristas, viagens, manutencoes, abastecimentos }, null, 2)}
      </pre>

      {/* MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 space-y-4 w-full max-w-md">

            <h2>{editingId ? 'Editar' : 'Novo'}</h2>

            {tab === 'frota' && (
              <>
                <input placeholder="Placa" value={formData.placa || ''} onChange={e => setFormData({...formData, placa: e.target.value})}/>
                <input placeholder="Modelo" value={formData.modelo || ''} onChange={e => setFormData({...formData, modelo: e.target.value})}/>
                <input type="number" placeholder="KM" value={formData.km_atual || ''} onChange={e => setFormData({...formData, km_atual: Number(e.target.value)})}/>
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

            {tab === 'manutencao' && (
              <>
                <input placeholder="Serviço" value={formData.servico || ''} onChange={e => setFormData({...formData, servico: e.target.value})}/>
                <input placeholder="Valor" value={formData.valor || ''} onChange={e => setFormData({...formData, valor: e.target.value})}/>
              </>
            )}

            {tab === 'combustivel' && (
              <>
                <input placeholder="Litros" value={formData.litros || ''} onChange={e => setFormData({...formData, litros: e.target.value})}/>
                <input placeholder="Total" value={formData.total || ''} onChange={e => setFormData({...formData, total: e.target.value})}/>
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
