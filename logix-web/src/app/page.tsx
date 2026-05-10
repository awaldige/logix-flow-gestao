'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type TabType =
  | 'frota'
  | 'motoristas'
  | 'viagens'
  | 'manutencao'
  | 'combustivel'

interface Veiculo {
  id: number
  modelo: string
  placa: string
  km_atual: number
  status: 'DISPONIVEL' | 'OCUPADO'
}

interface Motorista {
  id: number
  nome: string
  cnh: string
  telefone: string
  categoria: string
  status: 'ATIVO' | 'OCUPADO'
}

interface Viagem {
  id: number
  origem: string
  destino: string
  veiculo_id: number
  veiculo_modelo?: string
  veiculo_placa?: string
  motorista_id: number
  motorista_nome?: string
  status: 'EM_CURSO' | 'CONCLUIDA'
  km_inicial: number
  km_final?: number
  data_inicio: string
  data_fim?: string
}

interface Manutencao {
  id: number
  veiculo_id: number
  veiculo_placa?: string
  servico: string
  valor: number
  data: string
}

interface Abastecimento {
  id: number
  veiculo_id: number
  veiculo_placa?: string
  combustivel: string
  litros: number
  total: number
}

// Ícones
const Icons = {
  Truck: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  ),

  User: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),

  MapPin: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),

  Wrench: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),

  Fuel: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="3" y1="22" x2="15" y2="22" />
      <path d="M4 9h11" />
      <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" />
    </svg>
  ),

  Plus: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),

  Trash: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    </svg>
  ),

  X: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),

  ArrowRight: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
}

export default function App() {
  const [tab, setTab] = useState<TabType>('viagens')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [kmFinais, setKmFinais] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)

  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [motoristas, setMotoristas] = useState<Motorista[]>([])
  const [viagens, setViagens] = useState<Viagem[]>([])
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([])
  const [abastecimentos, setAbastecimentos] = useState<Abastecimento[]>([])

  const [formData, setFormData] = useState<any>({})

  // ==========================
  // BUSCAR DADOS
  // ==========================
  const fetchData = async () => {
    setLoading(true)

    const { data: v } = await supabase
      .from('vehicles')
      .select('*')
      .order('id')

    const { data: m } = await supabase
      .from('drivers')
      .select('*')
      .order('nome')

    const { data: tr } = await supabase
      .from('trips')
      .select(`
        *,
        vehicles:veiculo_id (modelo, placa),
        drivers:motorista_id (nome)
      `)
      .order('data_inicio', { ascending: false })

    const { data: mn } = await supabase
      .from('maintenances')
      .select(`
        *,
        vehicles:veiculo_id (placa)
      `)
      .order('data', { ascending: false })

    const { data: ab } = await supabase
      .from('fuel_logs')
      .select(`
        *,
        vehicles:veiculo_id (placa)
      `)
      .order('id', { ascending: false })

    if (v) setVeiculos(v)
    if (m) setMotoristas(m)

    if (tr) {
      setViagens(
        tr.map((item: any) => ({
          ...item,
          veiculo_modelo: item.vehicles?.modelo,
          veiculo_placa: item.vehicles?.placa,
          motorista_nome: item.drivers?.nome,
        }))
      )
    }

    if (mn) {
      setManutencoes(
        mn.map((item: any) => ({
          ...item,
          veiculo_placa: item.vehicles?.placa,
        }))
      )
    }

    if (ab) {
      setAbastecimentos(
        ab.map((item: any) => ({
          ...item,
          veiculo_placa: item.vehicles?.placa,
        }))
      )
    }

    setLoading(false)
  }

  // ==========================
  // REALTIME SUPABASE
  // ==========================
  useEffect(() => {
    fetchData()

    const channel = supabase
      .channel('realtime-logixflow')

      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vehicles' },
        () => fetchData()
      )

      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'drivers' },
        () => fetchData()
      )

      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'trips' },
        () => fetchData()
      )

      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'maintenances' },
        () => fetchData()
      )

      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'fuel_logs' },
        () => fetchData()
      )

      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // ==========================
  // RESET FORM
  // ==========================
  const resetForm = () => {
    setFormData({})
    setEditingId(null)
    setIsFormOpen(false)
  }

  // ==========================
  // EDITAR
  // ==========================
  const handleEdit = (item: any) => {
    setFormData({ ...item })
    setEditingId(item.id)
    setIsFormOpen(true)
  }

  // ==========================
  // EXCLUIR
  // ==========================
  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir?')) return

    let table = ''

    if (tab === 'viagens') table = 'trips'
    if (tab === 'frota') table = 'vehicles'
    if (tab === 'motoristas') table = 'drivers'
    if (tab === 'manutencao') table = 'maintenances'
    if (tab === 'combustivel') table = 'fuel_logs'

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

    if (error) {
      console.error(error)
      alert('Erro ao excluir')
    }
  }

  // ==========================
  // SALVAR
  // ==========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let table = ''

    if (tab === 'frota') table = 'vehicles'
    if (tab === 'motoristas') table = 'drivers'
    if (tab === 'viagens') table = 'trips'
    if (tab === 'manutencao') table = 'maintenances'
    if (tab === 'combustivel') table = 'fuel_logs'

    try {
      if (editingId) {
        const { error } = await supabase
          .from(table)
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
      } else {
        if (tab === 'viagens') {
          const vId = Number(formData.veiculo_id)
          const mId = Number(formData.motorista_id)

          const veiculo = veiculos.find(v => v.id === vId)

          const { error } = await supabase.from('trips').insert([
            {
              ...formData,
              status: 'EM_CURSO',
              km_inicial: veiculo?.km_atual || 0,
              data_inicio: new Date().toISOString(),
            },
          ])

          if (error) throw error

          await supabase
            .from('vehicles')
            .update({ status: 'OCUPADO' })
            .eq('id', vId)

          await supabase
            .from('drivers')
            .update({ status: 'OCUPADO' })
            .eq('id', mId)
        } else {
          const insertData = { ...formData }

          if (tab === 'frota') {
            insertData.status = 'DISPONIVEL'
          }

          if (tab === 'motoristas') {
            insertData.status = 'ATIVO'
          }

          const { error } = await supabase
            .from(table)
            .insert([insertData])

          if (error) throw error
        }
      }

      resetForm()
    } catch (error) {
      console.error(error)
      alert('Erro ao salvar')
    }
  }

  // ==========================
  // FINALIZAR VIAGEM
  // ==========================
  const finalizarViagem = async (tripId: number) => {
    const kmStr = kmFinais[tripId]
    const kmNum = Number(kmStr)

    const viagem = viagens.find(t => t.id === tripId)

    if (
      !kmStr ||
      isNaN(kmNum) ||
      kmNum <= (viagem?.km_inicial || 0)
    ) {
      alert('O KM final deve ser maior que o inicial.')
      return
    }

    await supabase
      .from('trips')
      .update({
        status: 'CONCLUIDA',
        km_final: kmNum,
        data_fim: new Date().toISOString(),
      })
      .eq('id', tripId)

    await supabase
      .from('vehicles')
      .update({
        km_atual: kmNum,
        status: 'DISPONIVEL',
      })
      .eq('id', viagem?.veiculo_id)

    await supabase
      .from('drivers')
      .update({
        status: 'ATIVO',
      })
      .eq('id', viagem?.motorista_id)

    const newKms = { ...kmFinais }
    delete newKms[tripId]
    setKmFinais(newKms)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">

          <div>
            <h1 className="text-4xl font-black italic text-white">
              LOGIX<span className="text-blue-600">FLOW</span>
            </h1>

            <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 font-bold">
              Gestão Profissional de Frota
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">

            {[
              { id: 'frota', label: 'Frota', icon: Icons.Truck },
              { id: 'motoristas', label: 'Motoristas', icon: Icons.User },
              { id: 'viagens', label: 'Viagens', icon: Icons.MapPin },
              { id: 'manutencao', label: 'Manutenção', icon: Icons.Wrench },
              { id: 'combustivel', label: 'Combustível', icon: Icons.Fuel },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id as TabType)
                  resetForm()
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  tab === t.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-900 text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <t.icon />
                  {t.label}
                </div>
              </button>
            ))}
          </nav>

          <button
            onClick={() => {
              setFormData({})
              setEditingId(null)
              setIsFormOpen(true)
            }}
            className="bg-white text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-2"
          >
            <Icons.Plus />
            Adicionar
          </button>
        </header>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-20 text-zinc-600">
            Sincronizando com Supabase...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* FROTA */}
            {tab === 'frota' &&
              veiculos.map(v => (
                <div
                  key={v.id}
                  className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl"
                >
                  <h2 className="text-2xl font-black text-white">
                    {v.placa}
                  </h2>

                  <p className="text-zinc-500 text-sm">
                    {v.modelo}
                  </p>

                  <div className="mt-4">
                    <span className="text-zinc-400 text-sm">
                      KM:
                    </span>

                    <span className="ml-2 font-bold text-white">
                      {v.km_atual}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={() => handleEdit(v)}
                      className="flex-1 bg-zinc-800 py-3 rounded-xl text-sm"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(v.id)}
                      className="px-4 bg-red-600 rounded-xl"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* MODAL */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">

            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-md">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white font-black text-xl">
                  {editingId ? 'Editar' : 'Novo'}
                </h2>

                <button onClick={resetForm}>
                  <Icons.X />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                {tab === 'frota' && (
                  <>
                    <input
                      className="input-field"
                      placeholder="Placa"
                      value={formData.placa || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          placa: e.target.value.toUpperCase(),
                        })
                      }
                    />

                    <input
                      className="input-field"
                      placeholder="Modelo"
                      value={formData.modelo || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          modelo: e.target.value,
                        })
                      }
                    />

                    <input
                      type="number"
                      className="input-field"
                      placeholder="KM Atual"
                      value={formData.km_atual || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          km_atual: Number(e.target.value),
                        })
                      }
                    />
                  </>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 py-4 rounded-2xl font-bold text-white"
                >
                  {editingId ? 'Salvar' : 'Confirmar'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .input-field {
          width: 100%;
          background: #000;
          border: 1px solid #27272a;
          padding: 1rem;
          border-radius: 1rem;
          color: white;
          outline: none;
        }

        .input-field:focus {
          border-color: #2563eb;
        }
      `}</style>
    </div>
  )
}
