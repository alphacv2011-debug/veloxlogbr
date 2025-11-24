import React, { useState } from 'react';
import { Settings, Plus, Trash2, Save, MapPin, User, Package, Truck, AlertCircle, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { TrackingData, TrackingEvent } from '../types';

interface AdminPanelProps {
  data: TrackingData;
  onUpdate: (newData: TrackingData) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ data, onUpdate, isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [newEvent, setNewEvent] = useState<Partial<TrackingEvent>>({
    status: '',
    location: '',
    icon: 'truck'
  });

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'zulufox145') {
      setIsAuthenticated(true);
      setLoginError(false);
      setPasswordInput('');
    } else {
      setLoginError(true);
    }
  };

  const handleInputChange = (field: keyof TrackingData, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  const handleAddEvent = () => {
    if (!newEvent.status || !newEvent.location) return;

    const now = new Date();
    const eventToAdd: TrackingEvent = {
      date: 'Hoje',
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      location: newEvent.location || '',
      status: newEvent.status || '',
      icon: newEvent.icon as any || 'truck'
    };

    onUpdate({
      ...data,
      events: [eventToAdd, ...data.events]
    });

    setNewEvent({ status: '', location: '', icon: 'truck' });
  };

  const handleDeleteEvent = (index: number) => {
    const newEvents = [...data.events];
    newEvents.splice(index, 1);
    onUpdate({ ...data, events: newEvents });
  };

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-dark-800 border-l border-white/10 shadow-2xl z-[100] animate-fade-in flex flex-col">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-brand-500" /> Acesso Restrito
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">Fechar</button>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="bg-dark-900 p-8 rounded-2xl border border-white/5 w-full max-w-sm shadow-xl">
                <div className="w-16 h-16 bg-brand-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Settings className="w-8 h-8 text-brand-500" />
                </div>
                <h3 className="text-center text-white font-bold text-lg mb-2">Área Administrativa</h3>
                <p className="text-center text-gray-400 text-sm mb-6">Digite a senha de administrador para gerenciar o rastreamento.</p>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input 
                            type="password" 
                            placeholder="Senha de acesso"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                            autoFocus
                        />
                    </div>
                    
                    {loginError && (
                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg animate-pulse">
                            <AlertCircle className="w-4 h-4" /> Senha incorreta
                        </div>
                    )}

                    <button 
                        type="submit"
                        className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        Entrar <ArrowRight className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
      </div>
    );
  }

  // Render Admin Panel Content
  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-dark-800 border-l border-white/10 shadow-2xl z-[100] overflow-y-auto animate-fade-in">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="bg-brand-600 p-2 rounded-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Painel Administrativo</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Fechar
          </button>
        </div>

        {/* Section: Delivery Info */}
        <div className="space-y-6 mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4" /> Dados do Destinatário
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Nome do Destinatário</label>
              <input 
                type="text" 
                value={data.recipient}
                onChange={(e) => handleInputChange('recipient', e.target.value)}
                className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Endereço Completo</label>
              <input 
                type="text" 
                value={data.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">CEP</label>
                <input 
                  type="text" 
                  value={data.cep}
                  onChange={(e) => handleInputChange('cep', e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Código de Rastreio</label>
                <input 
                  type="text" 
                  value={data.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white font-mono focus:ring-1 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>
             <div>
                <label className="block text-xs text-gray-500 mb-1">Previsão de Entrega</label>
                <input 
                  type="text" 
                  value={data.estimatedDelivery}
                  onChange={(e) => handleInputChange('estimatedDelivery', e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-brand-500 outline-none"
                />
              </div>
          </div>
        </div>

        {/* Section: Events */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4" /> Atualizações de Rastreio
          </h3>

          {/* Add New Event Form */}
          <div className="bg-dark-900/50 p-4 rounded-xl border border-white/5 border-dashed">
             <div className="grid grid-cols-1 gap-3 mb-3">
                <input 
                  type="text" 
                  placeholder="Status (ex: Saiu para entrega)" 
                  value={newEvent.status}
                  onChange={(e) => setNewEvent({...newEvent, status: e.target.value})}
                  className="w-full bg-dark-800 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-brand-500 outline-none"
                />
                <div className="flex gap-2">
                   <input 
                    type="text" 
                    placeholder="Local (ex: CD São Paulo)" 
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    className="flex-1 bg-dark-800 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-brand-500 outline-none"
                  />
                  <select 
                    value={newEvent.icon}
                    onChange={(e) => setNewEvent({...newEvent, icon: e.target.value as any})}
                    className="bg-dark-800 border border-white/10 rounded-lg p-2 text-sm text-white outline-none"
                  >
                    <option value="truck">Caminhão</option>
                    <option value="package">Pacote</option>
                    <option value="check">Check</option>
                    <option value="alert">Alerta</option>
                  </select>
                </div>
             </div>
             <button 
               onClick={handleAddEvent}
               className="w-full bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
             >
               <Plus className="w-4 h-4" /> Adicionar Atualização
             </button>
          </div>

          {/* Events List */}
          <div className="space-y-3">
             {data.events.map((event, idx) => (
               <div key={idx} className="group flex items-start justify-between bg-dark-900 p-3 rounded-lg border border-white/5">
                  <div className="flex gap-3">
                    <div className={`mt-1 p-1.5 rounded-full ${
                      event.icon === 'check' ? 'bg-green-500/20 text-green-500' :
                      event.icon === 'alert' ? 'bg-red-500/20 text-red-500' :
                      'bg-brand-500/20 text-brand-500'
                    }`}>
                       {event.icon === 'truck' && <Truck className="w-3 h-3" />}
                       {event.icon === 'package' && <Package className="w-3 h-3" />}
                       {event.icon === 'check' && <CheckCircle2 className="w-3 h-3" />}
                       {event.icon === 'alert' && <AlertCircle className="w-3 h-3" />}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{event.status}</p>
                      <p className="text-gray-500 text-xs">{event.location} • {event.date} - {event.time}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteEvent(idx)}
                    className="text-gray-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;