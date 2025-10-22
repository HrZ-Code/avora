import React, { useState, useEffect } from 'react';

const ProfessionalsManagement = ({ darkMode }) => {
  const [professionals, setProfessionals] = useState([]);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [workDays, setWorkDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  });
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  // Carregar profissionais do localStorage
  useEffect(() => {
    const savedProfessionals = localStorage.getItem('avoraProfessionals');
    if (savedProfessionals) {
      setProfessionals(JSON.parse(savedProfessionals));
    } else {
      // Dados iniciais de exemplo
      const initialProfessionals = [
        {
          id: 1,
          name: 'Maria Silva',
          specialty: 'Cabeleireira',
          workDays: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: false,
            sunday: false
          },
          startTime: '09:00',
          endTime: '17:00',
          active: true
        },
        {
          id: 2,
          name: 'João Santos',
          specialty: 'Barbeiro',
          workDays: {
            monday: false,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: false
          },
          startTime: '10:00',
          endTime: '19:00',
          active: true
        }
      ];
      setProfessionals(initialProfessionals);
      localStorage.setItem('avoraProfessionals', JSON.stringify(initialProfessionals));
    }
  }, []);

  // Salvar profissionais no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('avoraProfessionals', JSON.stringify(professionals));
  }, [professionals]);

  const handleWorkDayChange = (day) => {
    setWorkDays({
      ...workDays,
      [day]: !workDays[day]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!name.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    if (!specialty.trim()) {
      setError('Especialidade é obrigatória');
      return;
    }

    const workDaysSelected = Object.values(workDays).some(day => day);
    if (!workDaysSelected) {
      setError('Selecione pelo menos um dia de trabalho');
      return;
    }

    if (startTime >= endTime) {
      setError('Horário de início deve ser anterior ao horário de término');
      return;
    }

    if (editingId === null) {
      // Adicionar novo profissional
      const newProfessional = {
        id: Date.now(),
        name,
        specialty,
        workDays,
        startTime,
        endTime,
        active: true
      };
      setProfessionals([...professionals, newProfessional]);
    } else {
      // Atualizar profissional existente
      const updatedProfessionals = professionals.map(prof => 
        prof.id === editingId ? {
          ...prof,
          name,
          specialty,
          workDays,
          startTime,
          endTime
        } : prof
      );
      setProfessionals(updatedProfessionals);
      setEditingId(null);
    }

    // Limpar formulário
    setName('');
    setSpecialty('');
    setWorkDays({
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    });
    setStartTime('09:00');
    setEndTime('18:00');
  };

  const handleEdit = (professional) => {
    setName(professional.name);
    setSpecialty(professional.specialty);
    setWorkDays(professional.workDays);
    setStartTime(professional.startTime);
    setEndTime(professional.endTime);
    setEditingId(professional.id);
  };

  const handleToggleActive = (id) => {
    const updatedProfessionals = professionals.map(prof => 
      prof.id === id ? { ...prof, active: !prof.active } : prof
    );
    setProfessionals(updatedProfessionals);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este profissional?')) {
      const updatedProfessionals = professionals.filter(prof => prof.id !== id);
      setProfessionals(updatedProfessionals);
    }
  };

  const handleCancel = () => {
    setName('');
    setSpecialty('');
    setWorkDays({
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    });
    setStartTime('09:00');
    setEndTime('18:00');
    setEditingId(null);
    setError('');
  };

  // Função para formatar os dias de trabalho
  const formatWorkDays = (workDays) => {
    const days = {
      monday: 'Seg',
      tuesday: 'Ter',
      wednesday: 'Qua',
      thursday: 'Qui',
      friday: 'Sex',
      saturday: 'Sáb',
      sunday: 'Dom'
    };
    
    return Object.entries(workDays)
      .filter(([_, value]) => value)
      .map(([key, _]) => days[key])
      .join(', ');
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg p-6 max-w-4xl mx-auto transition-colors duration-300`}>
      <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
        Gerenciamento de Profissionais
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={`mb-8 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
          {editingId === null ? 'Adicionar Novo Profissional' : 'Editar Profissional'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="Nome do profissional"
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Especialidade
            </label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="Ex: Cabeleireiro, Barbeiro, Manicure"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Dias de Trabalho
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries({
              monday: 'Segunda',
              tuesday: 'Terça',
              wednesday: 'Quarta',
              thursday: 'Quinta',
              friday: 'Sexta',
              saturday: 'Sábado',
              sunday: 'Domingo'
            }).map(([day, label]) => (
              <label key={day} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={workDays[day]}
                  onChange={() => handleWorkDayChange(day)}
                  className="form-checkbox h-5 w-5 text-purple-600"
                />
                <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Horário de Início
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Horário de Término
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          {editingId !== null && (
            <button
              type="button"
              onClick={handleCancel}
              className={`px-4 py-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} rounded-md hover:opacity-90 transition-colors`}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md hover:opacity-90 transition-colors"
          >
            {editingId === null ? 'Adicionar' : 'Salvar Alterações'}
          </button>
        </div>
      </form>

      <div className={`overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Nome
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Especialidade
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Dias de Trabalho
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Horário
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Status
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Ações
              </th>
            </tr>
          </thead>
          <tbody className={`${darkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
            {professionals.length === 0 ? (
              <tr>
                <td colSpan="6" className={`px-6 py-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  Nenhum profissional cadastrado
                </td>
              </tr>
            ) : (
              professionals.map((professional) => (
                <tr key={professional.id} className={!professional.active ? 'opacity-60' : ''}>
                  <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {professional.name}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {professional.specialty}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {formatWorkDays(professional.workDays)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {professional.startTime} - {professional.endTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${professional.active 
                      ? darkMode ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800'
                      : darkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800'
                    }`}>
                      {professional.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(professional)}
                      className={`mr-2 ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-900'}`}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleActive(professional.id)}
                      className={`mr-2 ${professional.active 
                        ? darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'
                        : darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {professional.active ? 'Desativar' : 'Ativar'}
                    </button>
                    <button
                      onClick={() => handleDelete(professional.id)}
                      className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfessionalsManagement;
