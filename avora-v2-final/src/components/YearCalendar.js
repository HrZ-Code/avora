import React, { useState, useEffect } from 'react';

const YearCalendar = ({ darkMode }) => {
  // Estado para armazenar o ano atual
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Estado para armazenar o mês selecionado (0-11)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  
  // Estado para armazenar o dia selecionado
  const [selectedDay, setSelectedDay] = useState(null);
  
  // Estado para armazenar os agendamentos
  const [appointments, setAppointments] = useState({});
  
  // Estado para armazenar os profissionais
  const [professionals, setProfessionals] = useState([]);
  
  // Estado para o formulário de agendamento
  const [clientName, setClientName] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [selectedService, setSelectedService] = useState('');
  
  // Horários disponíveis
  const availableTimes = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];
  
  // Serviços disponíveis
  const availableServices = [
    { id: 1, name: 'Corte de Cabelo', duration: 30, price: 50 },
    { id: 2, name: 'Barba', duration: 20, price: 30 },
    { id: 3, name: 'Coloração', duration: 60, price: 120 },
    { id: 4, name: 'Manicure', duration: 45, price: 40 },
    { id: 5, name: 'Pedicure', duration: 45, price: 45 }
  ];
  
  // Nomes dos meses
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  // Dias da semana
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  // Carregar dados do localStorage
  useEffect(() => {
    const savedAppointments = localStorage.getItem('avoraAppointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
    
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
    }
  }, []);
  
  // Salvar agendamentos no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('avoraAppointments', JSON.stringify(appointments));
  }, [appointments]);
  
  // Função para obter o número de dias em um mês
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Função para obter o dia da semana do primeiro dia do mês (0-6)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Função para gerar os dias do mês atual
  const generateMonthDays = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Adicionar células vazias para os dias antes do primeiro dia do mês
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Adicionar os dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };
  
  // Função para verificar se um dia tem agendamentos
  const hasAppointments = (day) => {
    if (!day) return false;
    
    const dateKey = `${currentYear}-${selectedMonth + 1}-${day}`;
    return appointments[dateKey] && appointments[dateKey].length > 0;
  };
  
  // Função para contar o número de agendamentos em um dia
  const countAppointments = (day) => {
    if (!day) return 0;
    
    const dateKey = `${currentYear}-${selectedMonth + 1}-${day}`;
    return appointments[dateKey] ? appointments[dateKey].length : 0;
  };
  
  // Função para selecionar um dia
  const handleDayClick = (day) => {
    if (!day) return;
    
    setSelectedDay(day);
    setClientName('');
    setSelectedTime('');
    setSelectedProfessional('');
    setSelectedService('');
  };
  
  // Função para adicionar um agendamento
  const handleAddAppointment = () => {
    if (!selectedDay || !clientName.trim() || !selectedTime || !selectedProfessional || !selectedService) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    
    const dateKey = `${currentYear}-${selectedMonth + 1}-${selectedDay}`;
    
    // Verificar se o horário já está ocupado para o profissional selecionado
    const existingAppointments = appointments[dateKey] || [];
    const isTimeBooked = existingAppointments.some(
      app => app.time === selectedTime && app.professionalId === selectedProfessional
    );
    
    if (isTimeBooked) {
      alert('Este horário já está agendado para o profissional selecionado. Por favor, escolha outro horário.');
      return;
    }
    
    // Encontrar o serviço selecionado
    const service = availableServices.find(s => s.id === parseInt(selectedService));
    
    // Encontrar o profissional selecionado
    const professional = professionals.find(p => p.id === parseInt(selectedProfessional));
    
    // Criar novo agendamento
    const newAppointment = {
      id: Date.now(),
      clientName,
      time: selectedTime,
      professionalId: parseInt(selectedProfessional),
      professionalName: professional ? professional.name : '',
      serviceId: parseInt(selectedService),
      serviceName: service ? service.name : '',
      price: service ? service.price : 0
    };
    
    // Atualizar agendamentos
    const updatedAppointments = {
      ...appointments,
      [dateKey]: [...(appointments[dateKey] || []), newAppointment]
    };
    
    // Ordenar agendamentos por horário
    updatedAppointments[dateKey].sort((a, b) => a.time.localeCompare(b.time));
    
    setAppointments(updatedAppointments);
    
    // Limpar formulário
    setClientName('');
    setSelectedTime('');
    setSelectedProfessional('');
    setSelectedService('');
  };
  
  // Função para remover um agendamento
  const handleRemoveAppointment = (appointmentId) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      const dateKey = `${currentYear}-${selectedMonth + 1}-${selectedDay}`;
      
      const updatedAppointments = {
        ...appointments,
        [dateKey]: (appointments[dateKey] || []).filter(app => app.id !== appointmentId)
      };
      
      // Se não houver mais agendamentos para este dia, remover a entrada
      if (updatedAppointments[dateKey].length === 0) {
        delete updatedAppointments[dateKey];
      }
      
      setAppointments(updatedAppointments);
    }
  };
  
  // Função para mudar o mês
  const changeMonth = (offset) => {
    let newMonth = selectedMonth + offset;
    let newYear = currentYear;
    
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    
    setSelectedMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDay(null);
  };
  
  // Função para verificar se um profissional trabalha em um determinado dia
  const isProfessionalAvailable = (professional, day) => {
    if (!professional || !day) return false;
    
    const date = new Date(currentYear, selectedMonth, day);
    const dayOfWeek = date.getDay(); // 0 (domingo) a 6 (sábado)
    
    const dayMapping = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    };
    
    return professional.workDays[dayMapping[dayOfWeek]] && professional.active;
  };
  
  // Função para verificar se um horário está disponível para um profissional
  const isTimeAvailable = (time, professionalId) => {
    if (!selectedDay || !professionalId) return false;
    
    const dateKey = `${currentYear}-${selectedMonth + 1}-${selectedDay}`;
    const dayAppointments = appointments[dateKey] || [];
    
    // Verificar se o horário já está ocupado para o profissional
    return !dayAppointments.some(app => app.time === time && app.professionalId === parseInt(professionalId));
  };
  
  // Gerar os dias do mês atual
  const monthDays = generateMonthDays(currentYear, selectedMonth);
  
  // Filtrar profissionais ativos
  const activeProfessionals = professionals.filter(p => p.active);
  
  // Filtrar profissionais disponíveis para o dia selecionado
  const availableProfessionals = selectedDay 
    ? activeProfessionals.filter(p => isProfessionalAvailable(p, selectedDay))
    : [];
  
  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg p-6 max-w-6xl mx-auto transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-lg font-medium ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
          Calendário de Agendamentos
        </h3>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => changeMonth(-1)}
            className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {monthNames[selectedMonth]} {currentYear}
          </h2>
          
          <button 
            onClick={() => changeMonth(1)}
            className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
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
      
      <div className="grid grid-cols-7 gap-2 mb-6">
        {monthDays.map((day, index) => (
          <div 
            key={index} 
            className={`
              ${day ? (darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50') : 'bg-transparent'} 
              ${selectedDay === day ? `ring-2 ${darkMode ? 'ring-purple-500' : 'ring-purple-500'}` : ''}
              ${day ? `border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-md p-2 
                transition-all duration-200 cursor-pointer
                flex flex-col items-center min-h-[80px]` : ''}
            `}
            onClick={() => day && handleDayClick(day)}
          >
            {day && (
              <>
                <span className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {day}
                </span>
                
                {hasAppointments(day) && (
                  <div className={`mt-1 px-2 py-0.5 rounded-full text-xs ${darkMode ? 'bg-purple-900 text-purple-100' : 'bg-purple-100 text-purple-800'}`}>
                    {countAppointments(day)} {countAppointments(day) === 1 ? 'agendamento' : 'agendamentos'}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      
      {selectedDay && (
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
          <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
            Agendamentos para {selectedDay} de {monthNames[selectedMonth]} de {currentYear}
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className={`text-md font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Novo Agendamento
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Nome do Cliente
                  </label>
                  <input 
                    type="text" 
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="Digite o nome do cliente"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Profissional
                  </label>
                  <select 
                    value={selectedProfessional}
                    onChange={(e) => setSelectedProfessional(e.target.value)}
                    className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  >
                    <option value="">Selecione um profissional</option>
                    {availableProfessionals.length > 0 ? (
                      availableProfessionals.map((professional) => (
                        <option key={professional.id} value={professional.id}>
                          {professional.name} ({professional.specialty})
                        </option>
                      ))
                    ) : (
                      <option disabled>Nenhum profissional disponível neste dia</option>
                    )}
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Serviço
                  </label>
                  <select 
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  >
                    <option value="">Selecione um serviço</option>
                    {availableServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} - R$ {service.price.toFixed(2)} ({service.duration} min)
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Horário
                  </label>
                  <select 
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    disabled={!selectedProfessional}
                  >
                    <option value="">Selecione um horário</option>
                    {selectedProfessional && availableTimes.map((time) => {
                      const isAvailable = isTimeAvailable(time, selectedProfessional);
                      return (
                        <option key={time} value={time} disabled={!isAvailable}>
                          {time} {!isAvailable ? '(Ocupado)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
                
                <button 
                  onClick={handleAddAppointment}
                  disabled={!selectedDay || !clientName.trim() || !selectedTime || !selectedProfessional || !selectedService}
                  className={`w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md 
                    ${(!selectedDay || !clientName.trim() || !selectedTime || !selectedProfessional || !selectedService) 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:opacity-90'} 
                    transition-colors`}
                >
                  Adicionar Agendamento
                </button>
              </div>
            </div>
            
            <div>
              <h4 className={`text-md font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Agendamentos Existentes
              </h4>
              
              {selectedDay && (
                <div className={`border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-md overflow-hidden`}>
                  {appointments[`${currentYear}-${selectedMonth + 1}-${selectedDay}`]?.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                        <tr>
                          <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                            Horário
                          </th>
                          <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                            Cliente
                          </th>
                          <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                            Profissional
                          </th>
                          <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                            Serviço
                          </th>
                          <th scope="col" className={`px-4 py-3 text-center text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className={`${darkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
                        {appointments[`${currentYear}-${selectedMonth + 1}-${selectedDay}`].map((appointment) => (
                          <tr key={appointment.id}>
                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {appointment.time}
                            </td>
                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {appointment.clientName}
                            </td>
                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                              {appointment.professionalName}
                            </td>
                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                              {appointment.serviceName} (R$ {appointment.price?.toFixed(2)})
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                              <button
                                onClick={() => handleRemoveAppointment(appointment.id)}
                                className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}
                              >
                                Cancelar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Nenhum agendamento para este dia
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6 text-center text-sm">
        <p className={`${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>Clique em um dia para gerenciar os agendamentos</p>
        <p className={`${darkMode ? 'text-purple-200' : 'text-purple-500'}`}>Seus agendamentos serão salvos automaticamente</p>
      </div>
    </div>
  );
};

export default YearCalendar;
