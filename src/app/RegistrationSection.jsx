'use client';
import React, { useState, useEffect } from 'react';

const RegistrationSection = () => {
    const [showModal, setShowModal] = useState(false);
    const [currentForm, setCurrentForm] = useState('register'); // 'register' ou 'login'
    const [userType, setUserType] = useState('profissional'); // 'empresa' ou 'profissional'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        phone: ''
    });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Inicializar Google Sign-In
    useEffect(() => {
        const initializeGoogleSignIn = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: "216750858420-elok0gmesvjb1uc50am8ee9og6nmsgpn.apps.googleusercontent.com", // Substitua pelo seu Client ID
                    callback: handleGoogleSignIn,
                    auto_select: false,
                });
            }
        };

        // Carregar o script do Google se não estiver carregado
        if (!window.google) {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogleSignIn;
            document.head.appendChild(script);
        } else {
            initializeGoogleSignIn();
        }
    }, []);

    const handleGoogleSignIn = async (response) => {
        try {
            setLoading(true);
            // Decodificar o JWT token do Google
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            
            // Simular autenticação (substitua pela sua lógica de backend)
            const userData = {
                id: payload.sub,
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                loginMethod: 'google'
            };

            setUser(userData);
            setShowModal(false);
            
            // Aqui você enviaria os dados para seu backend
            console.log('Usuário logado via Google:', userData);
            
        } catch (error) {
            console.error('Erro no login com Google:', error);
            alert('Erro ao fazer login com Google. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (currentForm === 'register') {
                // Validações
                if (formData.password !== formData.confirmPassword) {
                    alert('As senhas não coincidem!');
                    return;
                }
                
                if (formData.password.length < 6) {
                    alert('A senha deve ter pelo menos 6 caracteres!');
                    return;
                }

                // Simular cadastro (substitua pela sua lógica de backend)
                const newUser = {
                    id: Date.now(),
                    name: userType === 'empresa' ? formData.companyName : formData.name,
                    email: formData.email,
                    userType,
                    phone: formData.phone,
                    loginMethod: 'email'
                };

                setUser(newUser);
                console.log('Usuário cadastrado:', newUser);
                
            } else {
                // Simular login (substitua pela sua lógica de backend)
                const userData = {
                    id: Date.now(),
                    name: formData.name || 'Usuário',
                    email: formData.email,
                    loginMethod: 'email'
                };

                setUser(userData);
                console.log('Usuário logado:', userData);
            }

            setShowModal(false);
            resetForm();
            
        } catch (error) {
            console.error('Erro na autenticação:', error);
            alert('Erro na autenticação. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            companyName: '',
            phone: ''
        });
    };

    const handleLogout = () => {
        setUser(null);
        // Logout do Google se necessário
        if (window.google) {
            window.google.accounts.id.disableAutoSelect();
        }
    };

    const renderGoogleButton = () => {
        return (
            <button
                type="button"
                className="w-auto flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                onClick={() => {
                    if (window.google) {
                        window.google.accounts.id.prompt();
                    }
                }}
                disabled={loading}
            >
                <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? 'Carregando...' : 'Continuar com Google'}
            </button>
        );
    };

    return (
        <section className="py-16 text-left bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold text-indigo-950">Como se cadastrar</h2>
                        
                        <div className="space-y-6">
                            <div className="bg-white p-6 ">
                                <h3 className="text-xl font-semibold text-indigo-950 mb-2">Empresa</h3>
                                <p className="text-gray-600">
                                    Cadastre sua empresa para publicar vagas e encontrar os melhores profissionais classificados para a sua vaga!
                                </p>
                            </div>
                            
                            <div className="bg-white p-6">
                                <h3 className="text-xl font-semibold text-indigo-950 mb-2">Profissional</h3>
                                <p className="text-gray-600">
                                    Crie seu perfil como profissional e encontre as melhores oportunidades de carreira.
                                </p>
                            </div>
                        </div>

                        {user ? (
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-900 font-medium mb-4">Bem-vindo, {user.name}!</p>
                                <button 
                                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
                                    onClick={handleLogout}
                                >
                                    Sair
                                </button>
                            </div>
                        ) : (
                            <button 
                                className="bg-yellow-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors duration-200"
                                onClick={() => setShowModal(true)}
                            >
                                Cadastre-se
                            </button>
                        )}
                    </div>
                    
                    <div className="flex justify-center">
                        <img 
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                            alt="Profissionais trabalhando"
                            className="rounded-lg shadow-xl max-w-full h-auto"
                        />
                    </div>
                </div>
            </div>

            {/* Modal de Autenticação */}
            {showModal && (
                <div className="fixed inset-0 backdrop-blur-2xl flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full  overflow-y-auto">
                        <div className="p-6">
                            <button 
                                className="relative text-gray-400 hover:text-gray-600 text-2xl"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>

                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-center text-indigo-950 pb-4">
                                    {currentForm === 'register' ? 'Cadastro' : 'Login'}
                                </h2>
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button 
                                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-500 ${
                                            currentForm === 'register' 
                                                ? 'bg-white text-indigo-900 shadow-sm' 
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                        onClick={() => setCurrentForm('register')}
                                    >
                                        Cadastro
                                    </button>
                                    <button 
                                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-500 ${
                                            currentForm === 'login' 
                                                ? 'bg-white text-indigo-900 shadow-sm' 
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                        onClick={() => setCurrentForm('login')}
                                    >
                                        Login
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {currentForm === 'register' && (
                                    <div className="py-4 flex">
                                        <label className="flex space-x-2">
                                            <input
                                                type="radio"
                                                name="userType"
                                                value="profissional"
                                                checked={userType === 'profissional'}
                                                onChange={(e) => setUserType(e.target.value)}
                                                className="text-indigo-900 focus:ring-indigo-900"
                                            />
                                            <span className="text-sm text-gray-700">Profissional</span>
                                        </label>
                                        <label className="flex  space-x-2">
                                            <input
                                                type="radio"
                                                name="userType"
                                                value="empresa"
                                                checked={userType === 'empresa'}
                                                onChange={(e) => setUserType(e.target.value)}
                                                className="text-indigo-900 focus:ring-indigo-900"
                                            />
                                            <span className="text-sm text-gray-700">Empresa</span>
                                        </label>
                                    </div>
                                )}

                                {currentForm === 'register' && (
                                    <>
                                        <input
                                            type="text"
                                            name={userType === 'empresa' ? 'companyName' : 'name'}
                                            placeholder={userType === 'empresa' ? 'Nome da Empresa' : 'Nome Completo'}
                                            value={userType === 'empresa' ? formData.companyName : formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-transparent"
                                            required
                                        />
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Telefone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-transparent"
                                            required
                                        />
                                    </>
                                )}

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="E-mail"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-transparent"
                                    required
                                />

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Senha"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-transparent"
                                    required
                                />

                                {currentForm === 'register' && (
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirmar Senha"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-transparent"
                                        required
                                    />
                                )}

                                <button 
                                    type="submit" 
                                    className="w-full bg-yellow-600 text-white py-2 rounded-md font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-bg-yellow-700 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? 'Carregando...' : (currentForm === 'register' ? 'Cadastrar' : 'Entrar')}
                                </button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">ou</span>
                                    </div>
                                </div>

                                {renderGoogleButton()}
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default RegistrationSection;