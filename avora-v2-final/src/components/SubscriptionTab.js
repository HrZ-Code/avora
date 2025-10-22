import React, { useState, useEffect } from 'react';

const SubscriptionTab = ({ darkMode }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Planos disponíveis
  const plans = [
    {
      id: 'free',
      name: 'Gratuito',
      price: 0,
      features: [
        'Calendário básico',
        'Até 5 agendamentos por dia',
        'Acesso a 1 profissional',
        'Suporte por email'
      ],
      recommended: false
    },
    {
      id: 'basic',
      name: 'Básico',
      price: 29.90,
      features: [
        'Calendário completo',
        'Agendamentos ilimitados',
        'Até 5 profissionais',
        'Relatórios básicos',
        'Suporte prioritário'
      ],
      recommended: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 59.90,
      features: [
        'Todas as funcionalidades do plano Básico',
        'Profissionais ilimitados',
        'Relatórios avançados',
        'Integração com Google Calendar',
        'Notificações por SMS',
        'Suporte 24/7'
      ],
      recommended: false
    }
  ];
  
  // Carregar plano selecionado do localStorage
  useEffect(() => {
    const savedPlan = localStorage.getItem('avoraSelectedPlan');
    if (savedPlan) {
      setSelectedPlan(savedPlan);
    }
  }, []);
  
  // Salvar plano selecionado no localStorage
  useEffect(() => {
    if (selectedPlan) {
      localStorage.setItem('avoraSelectedPlan', selectedPlan);
    }
  }, [selectedPlan]);
  
  // Função para selecionar um plano
  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
  };
  
  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg p-6 max-w-4xl mx-auto transition-colors duration-300`}>
      <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
        Planos de Assinatura
      </h2>
      
      <p className={`mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Escolha o plano que melhor se adapta às necessidades do seu negócio. Você pode mudar de plano a qualquer momento.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`
              rounded-lg overflow-hidden transition-all duration-300
              ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} 
              ${selectedPlan === plan.id ? `ring-2 ${darkMode ? 'ring-purple-500' : 'ring-purple-500'}` : ''}
              ${plan.recommended ? `${darkMode ? 'border-purple-500' : 'border-purple-500'} shadow-lg` : ''}
            `}
          >
            {plan.recommended && (
              <div className={`py-1 text-center text-sm font-medium text-white ${darkMode ? 'bg-purple-600' : 'bg-purple-600'}`}>
                Recomendado
              </div>
            )}
            
            <div className="p-6">
              <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              
              <div className="mb-4">
                <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price === 0 ? 'Grátis' : `R$${plan.price.toFixed(2)}`}
                </span>
                {plan.price > 0 && (
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>/mês</span>
                )}
              </div>
              
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className={`h-5 w-5 mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`
                  w-full py-2 rounded-md transition-colors
                  ${selectedPlan === plan.id 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' 
                    : darkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }
                `}
              >
                {selectedPlan === plan.id ? 'Plano Atual' : 'Selecionar Plano'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
        <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
          Informações Adicionais
        </h3>
        
        <div className="space-y-4">
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Todos os planos incluem atualizações gratuitas e acesso à nossa base de conhecimento.
          </p>
          
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Para mais informações sobre os planos ou para solicitar um plano personalizado para seu negócio, entre em contato com nossa equipe de vendas.
          </p>
          
          <div className="flex items-center">
            <svg className={`h-5 w-5 mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              contato@avora.com
            </span>
          </div>
          
          <div className="flex items-center">
            <svg className={`h-5 w-5 mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              (11) 9999-9999
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTab;
