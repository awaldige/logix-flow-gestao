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
  const [initialized, setInitialized] = useState(false)

  // --- Estados de Dados ---
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

  useEffect(() => {
    try {
      const v = localStorage.getItem('logix_veiculos')
      const m = localStorage.getItem('logix_motoristas')
      const tr = localStorage.getItem('logix_viagens')
      const mn = localStorage.getItem('logix_manutencoes')
      const ab = localStorage.getItem('logix_abastecimentos')
      
      if (v) setVeiculos(JSON.parse(v))
      if (m) setMotoristas(JSON.parse(m))
      if (tr) setViagens(JSON.parse(tr))
      if (mn) setManutencoes(JSON.parse(mn))
      if (ab) setAbastecimentos(JSON.parse(ab))
    } catch (err) {}
    setInitialized(true)
  }, [])

  useEffect(() => {
    if (initialized) {
      localStorage.setItem('logix_veiculos', JSON.stringify(veiculos))
      localStorage.setItem('logix_motoristas', JSON.stringify(motoristas))
      localStorage.setItem('logix_viagens', JSON.stringify(viagens))
      localStorage.setItem('logix_manutencoes', JSON.stringify(manutencoes))
      localStorage.setItem('logix_abastecimentos', JSON.stringify(abastecimentos))
    }
  }, [veiculos, motoristas, viagens, manutencoes, abastecimentos, initialized])

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

      if (tab === 'viagens') {
        const vId = Number(novoRegisto.veiculo_id);
        const mId = Number(novoRegisto.motorista_id);
        const veiculo = veiculos.find(v => v.id === vId);
        
        novoRegisto.status = 'EM_CURSO';
        novoRegisto.km_inicial = veiculo?.km_atual || 0;
        novoRegisto.veiculo_modelo = veiculo?.modelo || '';
        novoRegisto.veiculo_placa = veiculo?.placa || '';
        novoRegisto.data_inicio = new Date().toLocaleDateString('pt-BR');
        
        setVeiculos(v => v.map(item => item.id === vId ? { ...item, status: 'OCUPADO' } : item));
        setMotoristas(d => d.map(item => item.id === mId ? { ...item, status: 'OCUPADO' } : item));
        setViagens([novoRegisto, ...viagens]);
      } else if (tab === 'frota') {
        novoRegisto.status = 'DISPONIVEL';
        setVeiculos([...veiculos, novoRegisto]);
      } else if (tab === 'motoristas') {
        novoRegisto.status = 'ATIVO';
        setMotoristas([...motoristas, novoRegisto]);
      } else if (tab === 'manutencao') {
        const v = veiculos.find(x => x.id === Number(novoRegisto.veiculo_id));
        novoRegisto.veiculo_placa = v?.placa;
        setManutencoes([novoRegisto, ...manutencoes]);
      } else if (tab === 'combustivel') {
        const v = veiculos.find(x => x.id === Number(novoRegisto.veiculo_id));
        novoRegisto.veiculo_placa = v?.placa;
        setAbastecimentos([novoRegisto, ...abastecimentos]);
      }
    }
    resetForm();
  }

  const finalizarViagem = (tripId: number) => {
    const kmStr = kmFinais[tripId];
    const kmNum = Number(kmStr);
    const viagem = viagens.find(t => t.id === tripId);

    if (!kmStr || isNaN(kmNum) || kmNum <= (viagem?.km_inicial || 0)) {
      alert("O KM final deve ser maior que o KM inicial.");
      return; 
    }

    setViagens(prev => prev.map(t => t.id === tripId ? { 
      ...t, 
      status: 'CONCLUIDA', 
      km_final: kmNum,
      data_fim: new Date().toLocaleDateString('pt-BR')
    } : t));
    
    setVeiculos(prev => prev.map(v => v.id === Number(viagem?.veiculo_id) ? { ...v, km_atual: kmNum, status: 'DISPONIVEL' } : v));
    setMotoristas(prev => prev.map(d => d.id === Number(viagem?.motorista_id) ? { ...d, status: 'ATIVO' } : d));
    
    const newKms = { ...kmFinais };
    delete newKms[tripId];
    setKmFinais(newKms);
  }

  const getButtonLabel = () => {
    switch (tab) {
      case 'frota': return 'Frota';
      case 'motoristas': return 'Motorista';
      case 'viagens': return 'Viagem';
      case 'manutencao': return 'Serviço';
      case 'combustivel': return 'Posto';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Reorganizado */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">LOGIX<span className="text-blue-600">FLOW</span></h1>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em] mt-1">Gestão Profissional de Frota</p>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-1 bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800/30">
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all ${tab === t.id ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:text-white'}`}
              >
                <t.icon /> {t.label}
              </button>
            ))}
          </nav>

          <button onClick={() => { setFormData({}); setEditingId(null); setIsFormOpen(true); }} className="bg-white text-black px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2">
            <Icons.Plus /> Adicionar {getButtonLabel()}
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Aba FROTA */}
          {tab === 'frota' && veiculos.map(v => (
            <div key={v.id} className="bg-zinc-900/30 border border-zinc-800/60 p-8 rounded-[2.5rem] relative">
               <div className="flex justify-between items-start mb-4">
                  <div>
                     <h2 className="text-3xl font-black text-white italic leading-tight">{v.placa}</h2>
                     <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{v.modelo}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-[8px] font-black uppercase ${v.status === 'DISPONIVEL' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                     {v.status}
                  </div>
               </div>
               <div className="mt-8 pt-6 border-t border-zinc-800/50 flex justify-between items-baseline">
                  <span className="text-[8px] font-black text-zinc-600 uppercase">Odômetro Atual</span>
                  <span className="text-xl font-bold text-white">{v.km_atual.toLocaleString()} <span className="text-[10px] text-zinc-500">KM</span></span>
               </div>
               <div className="flex gap-2 mt-6">
                  <button onClick={() => handleEdit(v)} className="flex-1 border border-zinc-800 text-[8px] font-black uppercase py-3 rounded-xl hover:bg-zinc-800 transition-all">Editar</button>
                  <button onClick={() => handleDelete(v.id)} className="px-4 border border-zinc-800 text-zinc-600 hover:text-red-500 py-3 rounded-xl transition-all"><Icons.Trash /></button>
               </div>
            </div>
          ))}

          {/* Aba MOTORISTAS - Expandida */}
          {tab === 'motoristas' && motoristas.map(m => (
            <div key={m.id} className="bg-zinc-900/30 border border-zinc-800/60 p-8 rounded-[2.5rem]">
               <div className="flex justify-between items-start mb-6">
                  <div>
                     <h2 className="text-lg font-black text-white uppercase leading-tight">{m.nome}</h2>
                     <span className="text-[10px] font-mono text-zinc-500">CNH: {m.cnh}</span>
                  </div>
                  <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                     <span className="text-[14px] font-black text-blue-500">{m.categoria}</span>
                  </div>
               </div>
               
               <div className="space-y-3 mb-6">
                 <div className="flex items-center gap-2 text-zinc-400">
                    <Icons.Phone />
                    <span className="text-[11px] font-bold">{m.telefone}</span>
                 </div>
                 <div className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase ${m.status === 'ATIVO' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    {m.status}
                 </div>
               </div>

               <div className="flex gap-2 pt-4 border-t border-zinc-800/50">
                  <button onClick={() => handleEdit(m)} className="flex-1 text-[8px] font-black uppercase text-zinc-500 hover:text-white transition-all">Editar Cadastro</button>
                  <button onClick={() => handleDelete(m.id)} className="text-zinc-800 hover:text-red-500 transition-all"><Icons.Trash /></button>
               </div>
            </div>
          ))}
          
          {/* Aba VIAGENS */}
          {tab === 'viagens' && viagens.map(t => {
            const m = motoristas.find(e => e.id === Number(t.motorista_id));
            return (
              <div key={t.id} className="bg-zinc-900/30 border border-zinc-800/60 p-8 rounded-[2.5rem] relative">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-2 text-white font-black text-sm uppercase">
                         <span>{t.origem}</span>
                         <Icons.ArrowRight />
                         <span className="text-blue-500">{t.destino}</span>
                       </div>
                       <span className="text-[9px] text-zinc-600 font-bold uppercase">{t.data_inicio}</span>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${t.status === 'EM_CURSO' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                       {t.status === 'EM_CURSO' ? 'Em Trânsito' : 'Finalizada'}
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/30">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                         <span className="text-[8px] font-black text-zinc-700 uppercase block">Veículo</span>
                         <span className="text-[10px] font-bold text-white">{t.veiculo_placa}</span>
                       </div>
                       <div className="text-right">
                         <span className="text-[8px] font-black text-zinc-700 uppercase block">Modelo</span>
                         <span className="text-[10px] font-bold text-zinc-400">{t.veiculo_modelo}</span>
                       </div>
                    </div>
                    <div className="pt-2 border-t border-zinc-900">
                      <span className="text-[8px] font-black text-zinc-700 uppercase block">Condutor</span>
                      <span className="text-[10px] font-bold text-zinc-300">{m?.nome || '---'}</span>
                    </div>
                  </div>

                  <div className="flex justify-between border-b border-zinc-800/50 pb-2">
                    <span className="text-[9px] font-bold text-zinc-600 uppercase">Partida</span>
                    <span className="text-[10px] font-mono text-zinc-400">{t.km_inicial} KM</span>
                  </div>
                  {t.status === 'CONCLUIDA' && (
                    <div className="flex justify-between">
                      <span className="text-[9px] font-bold text-emerald-600 uppercase">Chegada</span>
                      <span className="text-[10px] font-mono text-emerald-400">{t.km_final} KM</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {t.status === 'EM_CURSO' ? (
                    <div className="flex gap-2">
                       <input 
                         type="number" 
                         placeholder="KM Chegada" 
                         className="bg-zinc-950 border border-zinc-800 px-4 py-3 rounded-xl text-xs w-full text-white outline-none focus:border-emerald-600"
                         value={kmFinais[t.id] || ''}
                         onChange={e => setKmFinais({...kmFinais, [t.id]: e.target.value})}
                       />
                       <button 
                         onClick={() => finalizarViagem(t.id)}
                         className="bg-emerald-600 text-white px-4 rounded-xl font-black uppercase text-[9px] hover:bg-emerald-500 transition-all flex items-center justify-center"
                       >
                         OK
                       </button>
                    </div>
                  ) : null}

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(t)} 
                      className="flex-1 border border-zinc-800/50 text-zinc-500 py-3 rounded-xl text-[9px] font-black uppercase hover:text-white hover:border-zinc-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Icons.Edit /> Editar
                    </button>

                    {t.status === 'CONCLUIDA' && (
                      <button 
                        onClick={() => handleDelete(t.id)} 
                        className="px-4 border border-zinc-800/50 text-zinc-700 py-3 rounded-xl hover:text-red-500 transition-all flex items-center justify-center"
                      >
                        <Icons.Trash />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Aba MANUTENÇÃO - Com Seletor de Veículo */}
          {tab === 'manutencao' && manutencoes.map(m => (
            <div key={m.id} className="bg-zinc-900/30 border border-zinc-800/60 p-8 rounded-[2.5rem]">
               <div className="flex items-center gap-3 text-orange-500 mb-4">
                  <Icons.Wrench />
                  <span className="text-[10px] font-black uppercase tracking-tighter">Oficina</span>
               </div>
               <h2 className="text-lg font-bold text-white mb-1 uppercase tracking-tight">{m.servico}</h2>
               <p className="text-[10px] text-zinc-500 font-black uppercase">{m.veiculo_placa}</p>
               <div className="mt-4 pt-4 border-t border-zinc-800/50 flex justify-between items-center">
                  <span className="text-[14px] font-black text-zinc-100">R$ {Number(m.valor).toLocaleString('pt-BR')}</span>
                  <span className="text-[9px] text-zinc-600 font-bold uppercase">{m.data}</span>
               </div>
               <button onClick={() => handleDelete(m.id)} className="w-full mt-4 text-[8px] font-black uppercase text-zinc-800 hover:text-red-900 transition-all">Remover</button>
            </div>
          ))}

          {/* Aba COMBUSTÍVEL - Com Seletor de Veículo */}
          {tab === 'combustivel' && abastecimentos.map(a => (
            <div key={a.id} className="bg-zinc-900/30 border border-zinc-800/60 p-8 rounded-[2.5rem]">
               <div className="flex items-center gap-3 text-blue-500 mb-4">
                  <Icons.Fuel />
                  <span className="text-[10px] font-black uppercase tracking-tighter">Abastecimento</span>
               </div>
               <div className="flex justify-between items-baseline mb-2">
                 <h2 className="text-xl font-black text-white">{a.litros} <span className="text-[10px] text-zinc-500">L</span></h2>
                 <span className="text-[10px] text-zinc-500 font-bold uppercase">{a.combustivel}</span>
               </div>
               <p className="text-[10px] text-zinc-400 font-black uppercase">{a.veiculo_placa}</p>
               <div className="mt-4 pt-4 border-t border-zinc-800/50 flex justify-between items-center">
                  <span className="text-[12px] font-bold text-zinc-100">R$ {Number(a.total).toLocaleString('pt-BR')}</span>
                  <button onClick={() => handleDelete(a.id)} className="text-zinc-800 hover:text-red-500"><Icons.Trash /></button>
               </div>
            </div>
          ))}
        </div>

        {/* Modal Único de Formulário */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#0a0a0a] border border-zinc-800 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
               <div className="flex justify-between items-center mb-8">
                 <h2 className="text-xl font-black text-white uppercase italic">
                   {editingId ? 'Editar' : 'Novo'} {tab === 'manutencao' ? 'Serviço' : tab === 'combustivel' ? 'Abastecimento' : tab.slice(0, -1)}
                 </h2>
                 <button onClick={resetForm} className="text-zinc-600 hover:text-white"><Icons.X /></button>
               </div>

               <form onSubmit={handleSubmit} className="space-y-4">
                 {/* Formulário Frota */}
                 {tab === 'frota' && (
                    <div className="space-y-4">
                      <input className="input-field" placeholder="Placa (Ex: ABC-1234)" value={formData.placa || ''} onChange={e => setFormData({...formData, placa: e.target.value.toUpperCase()})} required />
                      <input className="input-field" placeholder="Modelo do Veículo" value={formData.modelo || ''} onChange={e => setFormData({...formData, modelo: e.target.value})} required />
                      <input className="input-field" type="number" placeholder="KM Atual" value={formData.km_atual || ''} onChange={e => setFormData({...formData, km_atual: Number(e.target.value)})} required />
                    </div>
                 )}

                 {/* Formulário Motoristas */}
                 {tab === 'motoristas' && (
                    <div className="space-y-4">
                      <input className="input-field" placeholder="Nome Completo" value={formData.nome || ''} onChange={e => setFormData({...formData, nome: e.target.value})} required />
                      <div className="grid grid-cols-2 gap-3">
                        <input className="input-field" placeholder="Nº CNH" value={formData.cnh || ''} onChange={e => setFormData({...formData, cnh: e.target.value})} required />
                        <input className="input-field" placeholder="Cat. (ex: E)" value={formData.categoria || ''} onChange={e => setFormData({...formData, categoria: e.target.value.toUpperCase()})} required />
                      </div>
                      <input className="input-field" placeholder="Telefone (WhatsApp)" value={formData.telefone || ''} onChange={e => setFormData({...formData, telefone: e.target.value})} required />
                    </div>
                 )}

                 {/* Formulário Viagens */}
                 {tab === 'viagens' && (
                   <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label-field">Origem</label>
                        <input className="input-field" placeholder="Cidade Saída" value={formData.origem || ''} onChange={e => setFormData({...formData, origem: e.target.value})} required />
                      </div>
                      <div>
                        <label className="label-field">Destino</label>
                        <input className="input-field" placeholder="Cidade Chegada" value={formData.destino || ''} onChange={e => setFormData({...formData, destino: e.target.value})} required />
                      </div>
                    </div>
                    <div>
                      <label className="label-field">Veículo Disponível</label>
                      <select className="input-field" value={formData.veiculo_id || ''} onChange={e => setFormData({...formData, veiculo_id: e.target.value})} required>
                        <option value="">Selecione...</option>
                        {veiculos.filter(v => v.status === 'DISPONIVEL' || editingId).map(v => (
                          <option key={v.id} value={v.id}>{v.placa} - {v.modelo}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label-field">Motorista Ativo</label>
                      <select className="input-field" value={formData.motorista_id || ''} onChange={e => setFormData({...formData, motorista_id: e.target.value})} required>
                        <option value="">Selecione...</option>
                        {motoristas.filter(m => m.status === 'ATIVO' || editingId).map(m => (
                          <option key={m.id} value={m.id}>{m.nome}</option>
                        ))}
                      </select>
                    </div>
                   </>
                 )}

                 {/* Formulário Manutenção */}
                 {tab === 'manutencao' && (
                    <div className="space-y-4">
                      <div>
                        <label className="label-field">Veículo</label>
                        <select className="input-field" value={formData.veiculo_id || ''} onChange={e => setFormData({...formData, veiculo_id: e.target.value})} required>
                          <option value="">Selecione o veículo...</option>
                          {veiculos.map(v => (
                            <option key={v.id} value={v.id}>{v.placa} - {v.modelo}</option>
                          ))}
                        </select>
                      </div>
                      <input className="input-field" placeholder="Tipo de Serviço (Ex: Troca de Óleo)" value={formData.servico || ''} onChange={e => setFormData({...formData, servico: e.target.value})} required />
                      <input className="input-field" type="number" placeholder="Valor Gasto (R$)" value={formData.valor || ''} onChange={e => setFormData({...formData, valor: e.target.value})} required />
                      <input className="input-field" type="date" value={formData.data || ''} onChange={e => setFormData({...formData, data: e.target.value})} required />
                    </div>
                 )}

                 {/* Formulário Combustível */}
                 {tab === 'combustivel' && (
                    <div className="space-y-4">
                      <div>
                        <label className="label-field">Veículo</label>
                        <select className="input-field" value={formData.veiculo_id || ''} onChange={e => setFormData({...formData, veiculo_id: e.target.value})} required>
                          <option value="">Selecione o veículo...</option>
                          {veiculos.map(v => (
                            <option key={v.id} value={v.id}>{v.placa} - {v.modelo}</option>
                          ))}
                        </select>
                      </div>
                      <select className="input-field" value={formData.combustivel || ''} onChange={e => setFormData({...formData, combustivel: e.target.value})} required>
                        <option value="">Tipo de Combustível</option>
                        <option value="Diesel S10">Diesel S10</option>
                        <option value="Diesel S500">Diesel S500</option>
                        <option value="Arla 32">Arla 32</option>
                        <option value="Gasolina">Gasolina</option>
                      </select>
                      <div className="grid grid-cols-2 gap-3">
                        <input className="input-field" type="number" placeholder="Litros" value={formData.litros || ''} onChange={e => setFormData({...formData, litros: e.target.value})} required />
                        <input className="input-field" type="number" placeholder="Total R$" value={formData.total || ''} onChange={e => setFormData({...formData, total: e.target.value})} required />
                      </div>
                    </div>
                 )}

                 <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest mt-6 hover:bg-blue-500 transition-all">
                   Salvar Registro
                 </button>
               </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .input-field { @apply w-full bg-zinc-950 border border-zinc-900 p-4 rounded-xl text-xs font-bold text-white outline-none focus:border-blue-600 transition-all; }
        .label-field { @apply block text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1 ml-1; }
        select.input-field option { background: #0a0a0a; color: white; }
      `}</style>
    </div>
  )
}
