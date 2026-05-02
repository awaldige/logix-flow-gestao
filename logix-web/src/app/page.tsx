'use client'

import { useEffect, useState } from 'react'

// --- Ícones Inline SVG ---
const Icons = {
  Truck: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Wrench: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Fuel: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="15" y2="22"/><path d="M4 9h11"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Phone: () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
}

type TabType = 'frota' | 'motoristas' | 'viagens' | 'manutencao' | 'combustivel';

export default function App() {
  const [tab, setTab] = useState<TabType>('viagens')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [kmFinais, setKmFinais] = useState<Record<number, string>>({})

  const [veiculos, setVeiculos] = useState([
    { id: 1, modelo: 'Scania R450', placa: 'ABC-1234', km_atual: 152000, status: 'DISPONIVEL' }
  ])
  const [motoristas, setMotoristas] = useState([
    { id: 1, nome: 'Carlos Alberto Silva', cnh: '98765432100', telefone: '11 98888-7777', categoria: 'E', status: 'ATIVO' }
  ])
  const [viagens, setViagens] = useState<any[]>([])
  const [manutencoes, setManutencoes] = useState<any[]>([])
  const [abastecimentos, setAbastecimentos] = useState<any[]>([])

  const [formData, setFormData] = useState<any>({})

  const resetForm = () => {
    setFormData({})
    setEditingId(null)
    setIsFormOpen(false)
  }

  const handleEdit = (item: any) => {
    setFormData({ ...item });
    setEditingId(item.id);
    setIsFormOpen(true);
  }

  const handleDelete = (id: number) => {
    if (tab === 'viagens') setViagens(viagens.filter(v => v.id !== id));
    if (tab === 'frota') setVeiculos(veiculos.filter(v => v.id !== id));
    if (tab === 'motoristas') setMotoristas(motoristas.filter(e => e.id !== id));
    if (tab === 'manutencao') setManutencoes(manutencoes.filter(m => m.id !== id));
    if (tab === 'combustivel') setAbastecimentos(abastecimentos.filter(a => a.id !== id));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      if (tab === 'viagens') setViagens(viagens.map(v => v.id === editingId ? formData : v));
      if (tab === 'frota') setVeiculos(veiculos.map(v => v.id === editingId ? formData : v));
      if (tab === 'motoristas') setMotoristas(motoristas.map(e => e.id === editingId ? formData : e));
      if (tab === 'manutencao') setManutencoes(manutencoes.map(m => m.id === editingId ? formData : m));
      if (tab === 'combustivel') setAbastecimentos(abastecimentos.map(a => a.id === editingId ? formData : a));
    } else {
      const novoId = Date.now();
      const novoRegisto = { ...formData, id: novoId };

      if (tab === 'viagens') setViagens([novoRegisto, ...viagens]);
      if (tab === 'frota') setVeiculos([...veiculos, novoRegisto]);
      if (tab === 'motoristas') setMotoristas([...motoristas, novoRegisto]);
      if (tab === 'manutencao') setManutencoes([novoRegisto, ...manutencoes]);
      if (tab === 'combustivel') setAbastecimentos([novoRegisto, ...abastecimentos]);
    }

    resetForm();
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">

        <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">

          <nav className="flex flex-wrap gap-1 bg-zinc-900/50 p-1.5 rounded-2xl">
            {[
              { id: 'frota', label: 'Frota', icon: Icons.Truck },
              { id: 'motoristas', label: 'Motoristas', icon: Icons.User },
              { id: 'viagens', label: 'Viagens', icon: Icons.MapPin },
              { id: 'manutencao', label: 'Manutenção', icon: Icons.Wrench },
              { id: 'combustivel', label: 'Combustível', icon: Icons.Fuel },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id as TabType); resetForm(); }}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase ${tab === t.id ? 'bg-blue-600 text-white' : 'text-zinc-500'}`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-white text-black px-6 py-4 rounded-2xl font-black uppercase text-[10px]"
          >
            <Icons.Plus />
            {tab === 'frota'
              ? 'Adicionar Frota'
              : `Adicionar ${tab === 'manutencao' ? 'Serviço' : tab === 'combustivel' ? 'Posto' : tab.slice(0, -1)}`
            }
          </button>

        </header>

      </div>
    </div>
  )
}
