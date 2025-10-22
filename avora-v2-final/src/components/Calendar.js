import React, { useState, useEffect } from 'react';

const Calendar = ({ darkMode, toggleDarkMode }) => {
  // Estado para armazenar os dias do mês (30 dias)
  const [days, setDays] = useState(Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    marked: false,
    color: 'bg-white',
    appointments: [],
    clientName: ''
  })));

  // Estado para armazenar a cor selecionada atualmente
  const [selectedColor, setSelectedColor] = useState('bg-white');
  
  // Estado para armazenar o dia selecionado atualmente
  const [selectedDay, setSelectedDay] = useState(null);
  
  // Estado para armazenar o nome do cliente
  const [clientName, setClientName] = useState('');
  
  // Estado para armazenar o horário selecionado
  const [selectedTime, setSelectedTime] = useState('');

  // Dias da semana
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  // Horários disponíveis
  const availableTimes = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];
  
  // Cores disponíveis para seleção - usando as cores da logo para melhor visibilidade
  const availableColors = [
    { name: 'Padrão', value: darkMode ? 'bg-gray-700' : 'bg-white' },
    { name: 'Roxo Claro', value: 'bg-purple-100' },
    { name: 'Roxo Médio', value: 'bg-purple-200' },
    { name: 'Rosa Claro', value: 'bg-pink-100' },
    { name: 'Rosa Médio', value: 'bg-pink-200' },
    { name: 'Indigo', value: 'bg-indigo-100' }
  ];

  // Função para calcular o deslocamento inicial do calendário
  // Assumindo que o primeiro dia do mês começa em uma quarta-feira (índice 3)
  const firstDayOffset = 3;
  
  // Criar células vazias para o deslocamento inicial
  const emptyCells = Array.from({ length: firstDayOffset }, (_, i) => (
    <div key={`empty-${i}`} className={`border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'} rounded-md p-4 opacity-50`}></div>
  ));

  // Carregar dados do localStorage quando o componente montar
  useEffect(() => {
    const savedDays = localStorage.getItem('avoraDays');
    if (savedDays) {
      setDays(JSON.parse(savedDays));
    }
    
    const savedColor = localStorage.getItem('avoraSelectedColor');
    if (savedColor) {
      setSelectedColor(savedColor);
    }
  }, []);

  // Salvar dados no localStorage quando days ou selectedColor mudar
  useEffect(() => {
    localStorage.setItem('avoraDays', JSON.stringify(days));
  }, [days]);
  
  useEffect(() => {
    localStorage.setItem('avoraSelectedColor', selectedColor);
  }, [selectedColor]);

  // Função para marcar/desmarcar um dia e alterar sua cor
  const handleDayClick = (index) => {
    setSelectedDay(index);
    setClientName('');
    setSelectedTime('');
  };
  
  // Função para adicionar um agendamento
  const handleAddAppointment = () => {
    if (selectedDay === null || !clientName.trim() || !selectedTime) {
      alert('Por favor, selecione um dia, informe o nome do cliente e escolha um horário.');
      return;
    }
    
    // Verificar se o horário já está ocupado
    const dayData = days[selectedDay];
    const isTimeBooked = dayData.appointments.some(app => app.time === selectedTime);
    
    if (isTimeBooked) {
      alert('Este horário já está agendado. Por favor, escolha outro horário.');
      return;
    }
    
    const newDays = [...days];
    const day = newDays[selectedDay];
    
    day.marked = true;
    day.color = selectedColor;
    day.appointments.push({
      time: selectedTime,
      clientName: clientName,
      color: selectedColor
    });
    
    // Ordenar os agendamentos por horário
    day.appointments.sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
    
    setDays(newDays);
    setClientName('');
    setSelectedTime('');
  };
  
  // Função para remover um agendamento
  const handleRemoveAppointment = (dayIndex, appointmentIndex) => {
    const newDays = [...days];
    const day = newDays[dayIndex];
    
    day.appointments.splice(appointmentIndex, 1);
    
    if (day.appointments.length === 0) {
      day.marked = false;
      day.color = darkMode ? 'bg-gray-700' : 'bg-white';
    }
    
    setDays(newDays);
  };

  // Função para limpar todos os dados
  const handleClearAll = () => {
    if (window.confirm('Tem certeza que deseja limpar todas as marcações?')) {
      const clearedDays = days.map(day => ({
        ...day,
        marked: false,
        color: darkMode ? 'bg-gray-700' : 'bg-white',
        appointments: [],
        clientName: ''
      }));
      setDays(clearedDays);
      setSelectedDay(null);
      setClientName('');
      setSelectedTime('');
    }
  };

  // Função para determinar a cor do texto com base na cor de fundo
  const getTextColor = (bgColor) => {
    if (darkMode) {
      // No modo escuro, cores claras têm texto escuro
      if (bgColor.includes('bg-purple-100') || 
          bgColor.includes('bg-pink-100') || 
          bgColor.includes('bg-indigo-100') ||
          bgColor.includes('bg-purple-200') ||
          bgColor.includes('bg-pink-200')) {
        return 'text-gray-800';
      }
      return 'text-white';
    } else {
      // No modo claro, cores escuras têm texto claro
      if (bgColor.includes('bg-gray-700') || 
          bgColor.includes('bg-gray-800')) {
        return 'text-white';
      }
      return 'text-gray-800';
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg p-6 max-w-4xl mx-auto transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Calendário de Agendamentos</h3>
        <div className="flex space-x-2">
          <button 
            onClick={handleClearAll}
            className={`px-3 py-1 ${darkMode ? 'bg-red-900 text-white' : 'bg-red-50 text-red-600'} rounded-md hover:opacity-80 transition-colors text-sm`}
          >
            Limpar Tudo
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className={`text-center font-medium ${darkMode ? 'text-purple-300' : 'text-purple-700'} py-2`}
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {emptyCells}
        {days.map((day, index) => {
          const textColor = getTextColor(day.color);
          return (
            <div 
              key={index} 
              className={`
                ${day.color} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-md p-2 
                transition-all duration-200 hover:shadow-md cursor-pointer
                flex flex-col items-center min-h-[80px]
                ${selectedDay === index ? 'ring-2 ring-purple-500' : ''}
                ${darkMode && day.color === 'bg-white' ? 'bg-gray-700' : ''}
              `}
              onClick={() => handleDayClick(index)}
            >
              <span className={`text-lg font-medium ${textColor}`}>{day.day}</span>
              {day.appointments.length > 0 && (
                <div className="mt-1 w-full px-1">
                  <div className={`text-xs font-medium text-center ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                    {day.appointments.length} {day.appointments.length === 1 ? 'agendamento' : 'agendamentos'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedDay !== null && (
        <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
          <h3 className={`text-lg font-medium ${darkMode ? 'text-purple-300' : 'text-purple-700'} mb-3`}>
            Agendamentos para o dia {days[selectedDay].day}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-purple-200' : 'text-purple-600'} mb-1`}>
                Nome do Cliente
              </label>
              <input 
                type="text" 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-purple-200 bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Digite o nome do cliente"
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-purple-200' : 'text-purple-600'} mb-1`}>
                Horário
              </label>
              <select 
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-purple-200 bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="">Selecione um horário</option>
                {availableTimes.map((time) => {
                  const isBooked = days[selectedDay].appointments.some(app => app.time === time);
                  return (
                    <option key={time} value={time} disabled={isBooked}>
                      {time} {isBooked ? '(Ocupado)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-purple-200' : 'text-purple-600'} mb-1`}>
              Cor do Agendamento
            </label>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color, index) => (
                <div 
                  key={index}
                  className={`${color.value} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} rounded-full w-8 h-8 cursor-pointer 
                    hover:shadow-md transition-all duration-200
                    ${selectedColor === color.value ? 'ring-2 ring-purple-500' : ''}
                  `}
                  title={color.name}
                  onClick={() => setSelectedColor(color.value)}
                ></div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={handleAddAppointment}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md hover:opacity-90 transition-colors"
          >
            Adicionar Agendamento
          </button>
          
          {days[selectedDay].appointments.length > 0 && (
            <div className="mt-4">
              <h4 className={`text-md font-medium ${darkMode ? 'text-purple-300' : 'text-purple-700'} mb-2`}>
                Agendamentos Existentes
              </h4>
              <div className={`border ${darkMode ? 'border-gray-700' : 'border-purple-200'} rounded-md overflow-hidden`}>
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                    <tr>
                      <th className={`px-4 py-2 text-left text-sm font-medium ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>Horário</th>
                      <th className={`px-4 py-2 text-left text-sm font-medium ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>Cliente</th>
                      <th className={`px-4 py-2 text-center text-sm font-medium ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>Ações</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-purple-100'}`}>
                    {days[selectedDay].appointments.map((appointment, appIndex) => {
                      const textColor = getTextColor(appointment.color);
                      return (
                        <tr key={appIndex} className={`${appointment.color} ${darkMode && appointment.color === 'bg-white' ? 'bg-gray-700' : ''}`}>
                          <td className={`px-4 py-2 text-sm ${textColor}`}>{appointment.time}</td>
                          <td className={`px-4 py-2 text-sm ${textColor}`}>{appointment.clientName}</td>
                          <td className="px-4 py-2 text-center">
                            <button 
                              onClick={() => handleRemoveAppointment(selectedDay, appIndex)}
                              className={`${darkMode ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-800'} text-sm`}
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6 text-center text-sm">
        <p className={`${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>Clique em um dia para gerenciar os agendamentos</p>
        <p className={`${darkMode ? 'text-purple-200' : 'text-purple-500'}`}>Seus agendamentos serão salvos automaticamente</p>
      </div>
    </div>
  );
};

export default Calendar;
