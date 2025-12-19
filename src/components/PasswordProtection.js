'use client';
import { useState, useEffect } from 'react';

export default function PasswordProtection({ children, password = 'cuidadasuavida' }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [inputPassword, setInputPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is already authenticated (stored in sessionStorage)
    useEffect(() => {
        const authenticated = sessionStorage.getItem('comparativo_authenticated');
        if (authenticated === 'true') {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (inputPassword === password) {
            setIsAuthenticated(true);
            sessionStorage.setItem('comparativo_authenticated', 'true');
            setError('');
        } else {
            setError('Senha incorreta. Tente novamente.');
            setInputPassword('');
        }
    };

    // Show loading state briefly
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tec-blue"></div>
            </div>
        );
    }

    // Show password form if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50 px-4">
                <div className="max-w-md w-full">
                    {/* Lock Icon */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-tec-blue to-blue-600 rounded-full shadow-lg mb-4">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Conteúdo Protegido</h1>
                        <p className="text-gray-600">Esta página requer uma senha para acesso</p>
                    </div>

                    {/* Password Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Digite a senha
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={inputPassword}
                                    onChange={(e) => setInputPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tec-blue focus:border-transparent transition-all duration-200 text-gray-900"
                                    placeholder="••••••••••••"
                                    autoFocus
                                    required
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-medium">{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-tec-blue to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-tec-blue focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Acessar
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500 text-center">
                                Não tem a senha? Entre em contato conosco.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show protected content if authenticated
    return <>{children}</>;
}
