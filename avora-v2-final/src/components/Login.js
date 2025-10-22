import React, { useState, useEffect } from 'react';

const Login = ({ onLogin, darkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  // Simulação de banco de dados de usuários (em produção seria um backend real)
  const [users, setUsers] = useState([
    { email: 'admin@avora.com', password: 'admin123', name: 'Administrador', role: 'admin' },
    { email: 'user@avora.com', password: 'user123', name: 'Usuário Padrão', role: 'user' }
  ]);

  // Carregar usuários do localStorage ao iniciar
  useEffect(() => {
    const savedUsers = localStorage.getItem('avoraUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  // Salvar usuários no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('avoraUsers', JSON.stringify(users));
  }, [users]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Salvar usuário logado no localStorage
      localStorage.setItem('avoraCurrentUser', JSON.stringify({
        email: user.email,
        name: user.name,
        role: user.role
      }));
      
      onLogin({
        email: user.email,
        name: user.name,
        role: user.role
      });
    } else {
      setError('Email ou senha incorretos');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    
    // Validações básicas
    if (!name.trim()) {
      setError('Nome é obrigatório');
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      setError('Email inválido');
      return;
    }
    
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    // Verificar se o email já está em uso
    if (users.some(u => u.email === email)) {
      setError('Este email já está em uso');
      return;
    }
    
    // Adicionar novo usuário
    const newUser = {
      email,
      password,
      name,
      role: 'user' // Novos registros são sempre usuários padrão
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    
    // Fazer login automaticamente após o registro
    localStorage.setItem('avoraCurrentUser', JSON.stringify({
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    }));
    
    onLogin({
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    });
  };

  const handleGoogleLogin = () => {
    // Em uma implementação real, isso usaria a API do Google
    // Para este MVP, vamos simular um login com uma conta Google
    const googleUser = {
      email: 'google@example.com',
      name: 'Usuário Google',
      role: 'user'
    };
    
    // Verificar se o usuário já existe
    const existingUser = users.find(u => u.email === googleUser.email);
    
    if (!existingUser) {
      // Adicionar ao banco de dados se for novo
      const updatedUsers = [...users, {
        ...googleUser,
        password: 'google-auth' // Senha fictícia para usuários Google
      }];
      setUsers(updatedUsers);
    }
    
    // Salvar usuário logado
    localStorage.setItem('avoraCurrentUser', JSON.stringify(googleUser));
    
    onLogin(googleUser);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      <div className={`max-w-md w-full p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-light tracking-wider ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
            <span className={darkMode ? 'text-purple-300' : 'text-purple-500'}>[ </span>
            <span className={`font-medium bg-gradient-to-r ${darkMode ? 'from-purple-400 to-pink-400' : 'from-purple-600 to-pink-500'} bg-clip-text text-transparent`}>Avora</span>
            <span className={darkMode ? 'text-purple-300' : 'text-purple-500'}> ]</span>
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Sistema de Gerenciamento para Salões e Barbearias
          </p>
        </div>
        
        <h2 className={`text-2xl font-medium mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {isRegistering ? 'Criar Conta' : 'Entrar'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Seu nome completo"
              />
            </div>
          )}
          
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="seu@email.com"
            />
          </div>
          
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="******"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md hover:opacity-90 transition-colors"
          >
            {isRegistering ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>
        
        <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            className={`w-full py-2 px-4 flex items-center justify-center rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'} border border-gray-300 hover:bg-gray-50 transition-colors`}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Entrar com Google
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className={`text-sm ${darkMode ? 'text-purple-300 hover:text-purple-200' : 'text-purple-600 hover:text-purple-800'}`}
          >
            {isRegistering ? 'Já tem uma conta? Entrar' : 'Não tem uma conta? Cadastre-se'}
          </button>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Credenciais de demonstração:</p>
          <p>Admin: admin@avora.com / admin123</p>
          <p>Usuário: user@avora.com / user123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
