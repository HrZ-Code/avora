import React, { useState, useEffect } from 'react';

// Serviço para gerenciar o armazenamento persistente de dados
const DataService = {
  // Função para salvar dados no localStorage
  saveData: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Erro ao salvar dados para ${key}:`, error);
      return false;
    }
  },
  
  // Função para carregar dados do localStorage
  loadData: (key, defaultValue = null) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Erro ao carregar dados de ${key}:`, error);
      return defaultValue;
    }
  },
  
  // Função para remover dados do localStorage
  removeData: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Erro ao remover dados de ${key}:`, error);
      return false;
    }
  },
  
  // Função para limpar todos os dados do localStorage
  clearAllData: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Erro ao limpar todos os dados:', error);
      return false;
    }
  },
  
  // Chaves para os diferentes tipos de dados
  keys: {
    DARK_MODE: 'avoraDarkMode',
    ACTIVE_TAB: 'avoraActiveTab',
    CURRENT_USER: 'avoraCurrentUser',
    USERS: 'avoraUsers',
    PROFESSIONALS: 'avoraProfessionals',
    APPOINTMENTS: 'avoraAppointments',
    SELECTED_PLAN: 'avoraSelectedPlan'
  },
  
  // Função para exportar todos os dados como JSON
  exportData: () => {
    try {
      const exportData = {};
      
      // Iterar sobre todas as chaves conhecidas
      Object.values(DataService.keys).forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          exportData[key] = JSON.parse(data);
        }
      });
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      return null;
    }
  },
  
  // Função para importar dados de um JSON
  importData: (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      
      // Limpar dados existentes
      DataService.clearAllData();
      
      // Importar novos dados
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  },
  
  // Função para verificar o tamanho dos dados armazenados
  getStorageSize: () => {
    try {
      let totalSize = 0;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        totalSize += (key.length + value.length) * 2; // Aproximação em bytes
      }
      
      // Converter para KB
      return (totalSize / 1024).toFixed(2) + ' KB';
    } catch (error) {
      console.error('Erro ao calcular tamanho do armazenamento:', error);
      return '0 KB';
    }
  }
};

// Hook personalizado para usar o serviço de dados
export const useDataStorage = (key, defaultValue = null) => {
  const [data, setData] = useState(() => {
    return DataService.loadData(key, defaultValue);
  });
  
  useEffect(() => {
    DataService.saveData(key, data);
  }, [key, data]);
  
  return [data, setData];
};

export default DataService;
