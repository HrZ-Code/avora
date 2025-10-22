import React from 'react';
import Logo from './components/Logo';
import YearCalendar from './components/YearCalendar';
import SubscriptionTab from './components/SubscriptionTab';
import ProfessionalsManagement from './components/ProfessionalsManagement';
import Login from './components/Login';
import { useState, useEffect } from 'react';
import DataService, { useDataStorage } from './services/DataService';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useDataStorage(DataService.keys.ACTIVE_TAB, 'calendar');
  const [darkMode, setDarkMode] = useDataStorage(DataService.keys.DARK_MODE, false);
  const [user, setUser] = useState(null);
  
  // Carregar usuário do localStorage
  useEffect(() => {
    const savedUser = DataService.loadData(DataService.keys.CURRENT_USER);
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);
  
  // Função para alternar o modo escuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Função para lidar com o login
  const handleLogin = (userData) => {
    setUser(userData);
    DataService.saveData(DataService.keys.CURRENT_USER, userData);
  };
  
  // Função para lidar com o logout
  const handleLogout = () => {
    DataService.removeData(DataService.keys.CURRENT_USER);
    setUser(null);
  };
  
  // Se não houver usuário logado, mostrar tela de login
  if (!user) {
    return <Login onLogin={handleLogin} darkMode={darkMode} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 dark-mode' : 'bg-gradient-to-br from-gray-50 to-gray-100'} mode-transition`}>
      <div className="flex justify-between items-center px-4 py-2 bg-opacity-90 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <Logo darkMode={darkMode} />
        
        <div className="flex items-center space-x-4">
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Olá, {user.name}
          </span>
          
          <button 
            onClick={toggleDarkMode}
            className={`px-3 py-1 ${darkMode ? 'bg-gray-700 text-purple-300' : 'bg-purple-50 text-purple-700'} rounded-md hover:opacity-80 transition-colors text-sm`}
          >
            {darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
          </button>
          
          <button 
            onClick={handleLogout}
            className="px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm"
          >
            Sair
          </button>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-medium ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
            Gerenciador de Agendamentos
          </h2>
          <div className={`text-sm ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
            {user.role === 'admin' ? 'Acesso Administrativo' : 'Acesso de Usuário'}
          </div>
        </div>
        
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'calendar' 
              ? darkMode 
                ? 'text-purple-300 border-b-2 border-purple-500' 
                : 'text-purple-700 border-b-2 border-purple-500' 
              : darkMode 
                ? 'text-gray-400 hover:text-purple-300' 
                : 'text-gray-500 hover:text-purple-700'
            }`}
            onClick={() => setActiveTab('calendar')}
          >
            Calendário
          </button>
          
          {user.role === 'admin' && (
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'professionals' 
                ? darkMode 
                  ? 'text-purple-300 border-b-2 border-purple-500' 
                  : 'text-purple-700 border-b-2 border-purple-500' 
                : darkMode 
                  ? 'text-gray-400 hover:text-purple-300' 
                  : 'text-gray-500 hover:text-purple-700'
              }`}
              onClick={() => setActiveTab('professionals')}
            >
              Profissionais
            </button>
          )}
          
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'subscription' 
              ? darkMode 
                ? 'text-purple-300 border-b-2 border-purple-500' 
                : 'text-purple-700 border-b-2 border-purple-500' 
              : darkMode 
                ? 'text-gray-400 hover:text-purple-300' 
                : 'text-gray-500 hover:text-purple-700'
            }`}
            onClick={() => setActiveTab('subscription')}
          >
            Assinatura
          </button>
          
          {user.role === 'admin' && (
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'settings' 
                ? darkMode 
                  ? 'text-purple-300 border-b-2 border-purple-500' 
                  : 'text-purple-700 border-b-2 border-purple-500' 
                : darkMode 
                  ? 'text-gray-400 hover:text-purple-300' 
                  : 'text-gray-500 hover:text-purple-700'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              Configurações
            </button>
          )}
        </div>
        
        {activeTab === 'calendar' && <YearCalendar darkMode={darkMode} />}
        {activeTab === 'subscription' && <SubscriptionTab darkMode={darkMode} />}
        {activeTab === 'professionals' && user.role === 'admin' && <ProfessionalsManagement darkMode={darkMode} />}
        {activeTab === 'settings' && user.role === 'admin' && (
          <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg p-6 max-w-4xl mx-auto transition-colors duration-300`}>
            <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
              Configurações do Sistema
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                  Backup e Restauração
                </h3>
                
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      const data = DataService.exportData();
                      const blob = new Blob([data], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `avora-backup-${new Date().toISOString().split('T')[0]}.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                    className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md hover:opacity-90 transition-colors"
                  >
                    Exportar Dados
                  </button>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Importar Backup
                    </label>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target.result;
                            if (window.confirm('Tem certeza que deseja importar estes dados? Isso substituirá todos os dados atuais.')) {
                              const success = DataService.importData(result);
                              if (success) {
                                alert('Dados importados com sucesso! A página será recarregada.');
                                window.location.reload();
                              } else {
                                alert('Erro ao importar dados. Verifique o formato do arquivo.');
                              }
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                      className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                  Informações do Sistema
                </h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Versão:</span>
                    <span className={darkMode ? 'text-white' : 'text-gray-900'}>2.0.0</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Armazenamento utilizado:</span>
                    <span className={darkMode ? 'text-white' : 'text-gray-900'}>{DataService.getStorageSize()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Usuários cadastrados:</span>
                    <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                      {DataService.loadData(DataService.keys.USERS, []).length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Profissionais cadastrados:</span>
                    <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                      {DataService.loadData(DataService.keys.PROFESSIONALS, []).length}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
                        DataService.clearAllData();
                        alert('Todos os dados foram limpos. A página será recarregada.');
                        window.location.reload();
                      }
                    }}
                    className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Limpar Todos os Dados
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
