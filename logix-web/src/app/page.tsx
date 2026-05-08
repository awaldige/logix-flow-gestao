'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type TabType = 'frota' | 'motoristas' | 'viagens' | 'manutencao' | 'combustivel';

// Interfaces para bater com o banco PostgreSQL
interface Veiculo {
  id: number;
  modelo: string;
  placa: string;
  km_atual: number;
  status: 'DISPONIVEL' | 'OCUPADO';
}

interface Motorista {
  id: number;
  nome: string;
  cnh: string;
  telefone: string;
  categoria: string;
  status: 'ATIVO' | 'OCUPADO';
}

interface Viagem {
  id: number;
  origem: string;
  destino: string;
  veiculo_id: number;
  veiculo_modelo?: string;
  veiculo_placa?: string;
  motorista_id: number;
  motorista_nome?: string;
  status: 'EM_CURSO' | 'CONCLUIDA';
  km_inicial: number;
  km_final?: number;
  data_inicio: string;
  data_fim?: string;
}

interface Manutencao {
  id: number;
  veiculo_id: number;
  veiculo_placa?: string;
  servico: string;
  valor: number;
  data: string;
}

interface Abastecimento {
  id: number;
  veiculo_id: number;
  veiculo_placa?: string;
  combustivel: string;
  litros: number;
  total: number;
}

// Ícones Inline SVG
const Icons = {
  Truck: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Wrench: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Fuel: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="15" y2="22"/><path d="M4 9h11"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Phone: () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
};

export default function App() {
  const [tab, setTab] = useState<TabType>('viagens');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [kmFinais, setKmFinais] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  // Estados de Dados
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [abastecimentos, setAbastecimentos] = useState<Abastecimento[]>([]);

  const [formData, setFormData] = useState<any>({});

  // BUSCAR DADOS DO SUPABASE
  const fetchData = async () => {
    setLoading(true);
    
    // Consultas com Joins para pegar placa e modelo
    const { data: v } = await supabase.from('vehicles').select('*').order('id');
    const { data: m } = await supabase.from('drivers').select('*').order('nome');
    
    const { data: tr } = await supabase.from('trips').select(`
      *,
      vehicles:veiculo_id (modelo, placa),
      drivers:motorista_id (nome)
    `).order('data_inicio', { ascending: false });

    const { data: mn } = await supabase.from('maintenances').select(`
      *,
      vehicles:veiculo_id (placa)
    `).order('data', { ascending: false });

    const { data: ab } = await supabase.from('fuel_logs').select(`
      *,
      vehicles:veiculo_id (placa)
    `).order('id', { ascending: false });

    if (v) setVeiculos(v);
    if (m) setMotoristas(m);
    
    if (tr) setViagens(tr.map((item: any) => ({
      ...item,
      veiculo_modelo: item.vehicles?.modelo,
      veiculo_placa: item.vehicles?.placa,
      motorista_nome: item.drivers?.nome
    })));

    if (mn) setManutencoes(mn.map((item: any) => ({ 
      ...item, 
      veiculo_placa: item.vehicles?.placa 
    })));

    if (ab) setAbastecimentos(ab.map((item: any) => ({ 
      ...item, 
      veiculo_placa: item.vehicles?.placa 
    })));

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (item: any) => {
    setFormData({ ...item });
    setEditingId(item.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Tem certeza que deseja excluir?")) return;
    
    let table = '';
    if (tab === 'viagens') table = 'trips';
    if (tab === 'frota') table = 'vehicles';
    if (tab === 'motoristas') table = 'drivers';
    if (tab === 'manutencao') table = 'maintenances';
    if (tab === 'combustivel') table = 'fuel_logs';

    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) fetchData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let table = '';
    if (tab === 'frota') table = 'vehicles';
    if (tab === 'motoristas') table = 'drivers';
    if (tab === 'viagens') table = 'trips';
    if (tab === 'manutencao') table = 'maintenances';
    if (tab === 'combustivel') table = 'fuel_logs';

    if (editingId) {
      await supabase.from(table).update(formData).eq('id', editingId);
    } else {
      if (tab === 'viagens') {
        const vId = Number(formData.veiculo_id);
        const mId = Number(formData.motorista_id);
        const veiculo = veiculos.find(v => v.id === vId);
        
        await supabase.from('trips').insert([{
          ...formData,
          status: 'EM_CURSO',
          km_inicial: veiculo?.km_atual || 0,
          data_inicio: new Date().toISOString()
        }]);

        await supabase.from('vehicles').update({ status: 'OCUPADO' }).eq('id', vId);
        await supabase.from('drivers').update({ status: 'OCUPADO' }).eq('id', mId);
      } else {
        const insertData = { ...formData };
        if(tab === 'frota') insertData.status = 'DISPONIVEL';
        if(tab === 'motoristas') insertData.status = 'ATIVO';
        
        await supabase.from(table).insert([insertData]);
      }
    }
    fetchData();
    resetForm();
  };

  const finalizarViagem = async (tripId: number) => {
    const kmStr = kmFinais[tripId];
    const kmNum = Number(kmStr);
    const viagem = viagens.find(t => t.id === tripId);

    if (!kmStr || isNaN(kmNum) || kmNum <= (viagem?.km_inicial || 0)) {
      alert("O KM final deve ser maior que o KM inicial.");
      return; 
    }

    await supabase.from('trips').update({
      status: 'CONCLUIDA',
      km_final: kmNum,
      data_fim: new Date().toISOString()
    }).eq('id', tripId);

    await supabase.from('vehicles').update({ 
      km_atual: kmNum, 
      status: 'DISPONIVEL' 
    }).eq('id', viagem?.veiculo_id);

    await supabase.from('drivers').update({ 
      status: 'ATIVO' 
    }).eq('id', viagem?.motorista_id);
    
    fetchData();
    const newKms = { ...kmFinais };
    delete newKms[tripId];
    setKmFinais(newKms);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
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
            <Icons.Plus /> Adicionar {tab}
          </button>
        </header>

        {loading ? (
           <div className="text-center py-20 font-black uppercase text-zinc-800 tracking-widest animate-pulse">Sincronizando com Supabase...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Listagem de Frota */}
            {tab === 'frota' && veiculos.map(v => (
              <div key={v.id} className="bg-zinc-900/30 border border-zinc-800/60 p-8 rounded-[2.5rem]">
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
                    <span className="text-[8px] font-black text-zinc-600 uppercase">Odômetro</span>
                    <span className="text-xl font-bold text-white">{v.km_atual?.toLocaleString()} <span className="text-[10px] text-zinc-500">KM</span></span>
                 </div>
                 <div className="flex gap-2 mt-6">
                    <button onClick={() => handleEdit(v)} className="flex-1 border border-zinc-800 text-[8px] font-black uppercase py-3 rounded-xl hover:bg-zinc-800 transition-all">Editar</button>
                    <button onClick={() => handleDelete(v.id)} className="px-4 border border-zinc-800 text-zinc-600 hover:text-red-500 py-3 rounded-xl transition-all"><Icons.Trash /></button>
                 </div>
              </div>
            ))}

            {/* Listagem de Motoristas */}
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
                 <div className="flex items-center gap-2 text-zinc-400 mb-4">
                    <Icons.Phone />
                    <span className="text-[11px] font-bold">{m.telefone}</span>
                 </div>
                 <div className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase ${m.status === 'ATIVO' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    {m.status}
                 </div>
                 <div className="flex gap-2 pt-4 mt-4 border-t border-zinc-800/50">
                    <button onClick={() => handleEdit(m)} className="flex-1 text-[8px] font-black uppercase text-zinc-500 hover:text-white transition-all">Editar</button>
                    <button onClick={() => handleDelete(m.id)} className="text-zinc-800 hover:text-red-500 transition-all"><Icons.Trash /></button>
                 </div>
              </div>
            ))}

            {/* Listagem de Viagens */}
            {tab === 'viagens' && viagens.map(t => (
                <div key={t.id} className="bg-zinc-900/30 border border-zinc-800/60 p-8 rounded-[2.5rem]">
                  <div className="flex justify-between items-start mb-6">
                      <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-white font-black text-sm uppercase">
                            <span>{t.origem}</span>
                            <Icons.ArrowRight />
                            <span className="text-blue-500">{t.destino}</span>
                          </div>
                          <span className="text-[9px] text-zinc-600 font-bold uppercase">
                             {new Date(t.data_inicio).toLocaleDateString('pt-BR')}
                          </span>
                      </div>
                      <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${t.status === 'EM_CURSO' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                         {t.status === 'EM_CURSO' ? 'Em Trânsito' : 'Finalizada'}
                      </div>
                  </div>

                  <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/30 mb-6">
                      <div className="flex justify-between items-center">
                         <div>
                           <span className="text-[8px] font-black text-zinc-700 uppercase block">Veículo</span>
                           <span className="text-[10px] font-bold text-white">{t.veiculo_placa}</span>
                         </div>
                         <div className="text-right">
                           <span className="text-[8px] font-black text-zinc-700 uppercase block">Motorista</span>
                           <span className="text-[10px] font-bold text-zinc-400">{t.motorista_nome}</span>
                         </div>
                      </div>
                  </div>

                  {t.status === 'EM_CURSO' && (
                    <div className="flex gap-2">
                         <input 
                           type="number" 
                           placeholder="KM Final" 
                           className="bg-zinc-950 border border-zinc-800 px-4 py-3 rounded-xl text-xs w-full text-white outline-none focus:border-emerald-600"
                           value={kmFinais[t.id] || ''}
                           onChange={e => setKmFinais({...kmFinais, [t.id]: e.target.value})}
                         />
                         <button onClick={() => finalizarViagem(t.id)} className="bg-emerald-600 text-white px-4 rounded-xl font-black uppercase text-[9px] hover:bg-emerald-500">OK</button>
                    </div>
                  )}
                </div>
            ))}
          </div>
        )}

        {/* Modal de Formulário */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#0a0a0a] border border-zinc-800 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
               <div className="flex justify-between items-center mb-8">
                 <h2 className="text-xl font-black text-white uppercase italic">{editingId ? 'Editar' : 'Novo'} {tab}</h2>
                 <button onClick={resetForm} className="text-zinc-600 hover:text-white"><Icons.X /></button>
               </div>

               <form onSubmit={handleSubmit} className="space-y-4">
                 {tab === 'frota' && (
                    <div className="space-y-4">
                      <input className="input-field" placeholder="Placa" value={formData.placa || ''} onChange={e => setFormData({...formData, placa: e.target.value.toUpperCase()})} required />
                      <input className="input-field" placeholder="Modelo" value={formData.modelo || ''} onChange={e => setFormData({...formData, modelo: e.target.value})} required />
                      <input className="input-field" type="number" placeholder="KM Inicial" value={formData.km_atual || ''} onChange={e => setFormData({...formData, km_atual: Number(e.target.value)})} required />
                    </div>
                 )}

                 {tab === 'motoristas' && (
                    <div className="space-y-4">
                      <input className="input-field" placeholder="Nome" value={formData.nome || ''} onChange={e => setFormData({...formData, nome: e.target.value})} required />
                      <input className="input-field" placeholder="CNH" value={formData.cnh || ''} onChange={e => setFormData({...formData, cnh: e.target.value})} required />
                      <input className="input-field" placeholder="Cat." value={formData.categoria || ''} onChange={e => setFormData({...formData, categoria: e.target.value.toUpperCase()})} required />
                      <input className="input-field" placeholder="Telefone" value={formData.telefone || ''} onChange={e => setFormData({...formData, telefone: e.target.value})} required />
                    </div>
                 )}

                 {tab === 'viagens' && (
                   <div className="space-y-4">
                      <input className="input-field" placeholder="Origem" value={formData.origem || ''} onChange={e => setFormData({...formData, origem: e.target.value})} required />
                      <input className="input-field" placeholder="Destino" value={formData.destino || ''} onChange={e => setFormData({...formData, destino: e.target.value})} required />
                      <select className="input-field" value={formData.veiculo_id || ''} onChange={e => setFormData({...formData, veiculo_id: e.target.value})} required>
                        <option value="">Veículo...</option>
                        {veiculos.filter(v => v.status === 'DISPONIVEL').map(v => (
                          <option key={v.id} value={v.id}>{v.placa}</option>
                        ))}
                      </select>
                      <select className="input-field" value={formData.motorista_id || ''} onChange={e => setFormData({...formData, motorista_id: e.target.value})} required>
                        <option value="">Motorista...</option>
                        {motoristas.filter(m => m.status === 'ATIVO').map(m => (
                          <option key={m.id} value={m.id}>{m.nome}</option>
                        ))}
                      </select>
                   </div>
                 )}

                 <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-500">
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
          border: 1px solid #222;
          padding: 1rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          color: #fff;
          outline: none;
        }
        .input-field:focus { border-color: #2563eb; }
      `}</style>
    </div>
  )
}
