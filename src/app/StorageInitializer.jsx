'use client';
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database, Folder } from 'lucide-react';
import { initializeStorage, createBucketIfNotExists, ensureBucketExists, supabase } from '../lib/supabase';

const StorageInitializer = ({ children }) => {
    const [storageStatus, setStorageStatus] = useState({
        initialized: false,
        loading: true,
        error: null,
        bucketExists: false,
        bucketCreated: false
    });

    const [bucketInfo, setBucketInfo] = useState(null);

    const checkStorageStatus = async () => {
        setStorageStatus(prev => ({ ...prev, loading: true, error: null }));

        try {
            console.log('🔍 Verificando status do storage...');

            // 1. Verificar conexão com Supabase
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            console.log('Conexão Supabase:', authError ? 'ERRO' : 'OK');

            // 2. Listar buckets existentes
            const { data: buckets, error: listError } = await supabase.storage.listBuckets();
            
            if (listError) {
                throw new Error(`Erro ao listar buckets: ${listError.message}`);
            }

            console.log('📁 Buckets existentes:', buckets.map(b => b.name));

            // 3. Verificar se o bucket 'curriculos' existe
            const curriculosBucket = buckets.find(bucket => bucket.name === 'curriculos');
            
            if (curriculosBucket) {
                console.log('✅ Bucket "curriculos" encontrado:', curriculosBucket);
                setBucketInfo(curriculosBucket);
                setStorageStatus({
                    initialized: true,
                    loading: false,
                    error: null,
                    bucketExists: true,
                    bucketCreated: false
                });
            } else {
                console.log('❌ Bucket "curriculos" não encontrado');
                setStorageStatus({
                    initialized: false,
                    loading: false,
                    error: null,
                    bucketExists: false,
                    bucketCreated: false
                });
            }

        } catch (error) {
            console.error('❌ Erro ao verificar storage:', error);
            setStorageStatus({
                initialized: false,
                loading: false,
                error: error.message,
                bucketExists: false,
                bucketCreated: false
            });
        }
    };

    const createBucket = async () => {
        setStorageStatus(prev => ({ ...prev, loading: true, error: null }));

        try {
            console.log('🔧 Tentando criar bucket "curriculos"...');
            
            //const result = await createBucketIfNotExists('curriculos');
            
            /* if (result.success) {
                console.log('✅ Bucket criado com sucesso!');
                setStorageStatus({
                    initialized: true,
                    loading: false,
                    error: null,
                    bucketExists: true,
                    bucketCreated: true
                });
                
                // Recarregar informações do bucket
                await checkStorageStatus(); 
                
            } else {
                throw new Error(result.error?.message || 'Erro desconhecido ao criar bucket');
            }*/

        } catch (error) {
            console.error('❌ Erro ao criar bucket:', error);
            setStorageStatus(prev => ({
                ...prev,
                loading: false,
                error: error.message
            }));
        }
    };

    const initializeCompleteStorage = async () => {
        setStorageStatus(prev => ({ ...prev, loading: true, error: null }));

        try {
            console.log('🚀 Inicializando storage completo...');
            
            const result = await initializeStorage();
            
            if (result.success) {
                console.log('✅ Storage inicializado com sucesso!');
                await checkStorageStatus();
            } else {
                throw new Error(result.error?.message || result.message || 'Erro na inicialização');
            }

        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
            setStorageStatus(prev => ({
                ...prev,
                loading: false,
                error: error.message
            }));
        }
    };

    useEffect(() => {
        checkStorageStatus();
    }, []);

    // Se o storage está inicializado, renderizar os children normalmente
    if (storageStatus.initialized) {
        return (
            <>
                <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-3 shadow-lg">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={20} />
                        <span className="text-green-800 text-sm font-medium">Storage OK</span>
                    </div>
                </div>
                {children}
            </>
        );
    }

    // Interface de configuração do storage
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <Database className="text-blue-600" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Configuração do Storage
                    </h1>
                    <p className="text-gray-600">
                        Configurando o armazenamento de arquivos do sistema
                    </p>
                </div>

                {/* Status atual */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Conexão Supabase</span>
                        <CheckCircle className="text-green-600" size={20} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Bucket "curriculos"</span>
                        {storageStatus.loading ? (
                            <RefreshCw className="text-blue-600 animate-spin" size={20} />
                        ) : storageStatus.bucketExists ? (
                            <CheckCircle className="text-green-600" size={20} />
                        ) : (
                            <XCircle className="text-red-600" size={20} />
                        )}
                    </div>

                    {bucketInfo && (
                        <div className="text-xs text-gray-500 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <Folder size={14} />
                                <span>Bucket configurado:</span>
                            </div>
                            <div className="pl-4 space-y-1">
                                <div>ID: {bucketInfo.id}</div>
                                <div>Público: {bucketInfo.public ? 'Sim' : 'Não'}</div>
                                <div>Criado: {new Date(bucketInfo.created_at).toLocaleString('pt-BR')}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mensagem de erro */}
                {storageStatus.error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <h3 className="text-red-800 font-semibold text-sm">Erro na configuração</h3>
                                <p className="text-red-700 text-sm mt-1">{storageStatus.error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Ações */}
                <div className="space-y-3">
                    {!storageStatus.bucketExists && (
                        <button
                            onClick={createBucket}
                            disabled={storageStatus.loading}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {storageStatus.loading ? (
                                <>
                                    <RefreshCw className="animate-spin" size={20} />
                                    Criando bucket...
                                </>
                            ) : (
                                <>
                                    <Folder size={20} />
                                    Criar Bucket "curriculos"
                                </>
                            )}
                        </button>
                    )}

                    <button
                        onClick={initializeCompleteStorage}
                        disabled={storageStatus.loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {storageStatus.loading ? (
                            <>
                                <RefreshCw className="animate-spin" size={20} />
                                Inicializando...
                            </>
                        ) : (
                            <>
                                <Database size={20} />
                                Inicializar Storage Completo
                            </>
                        )}
                    </button>

                    <button
                        onClick={checkStorageStatus}
                        disabled={storageStatus.loading}
                        className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={16} />
                        Verificar Novamente
                    </button>
                </div>

                {/* Instruções manuais */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="text-yellow-800 font-semibold text-sm mb-2">
                        Configuração Manual (se necessário)
                    </h4>
                    <div className="text-yellow-700 text-xs space-y-1">
                        <p>1. Acesse o dashboard do Supabase</p>
                        <p>2. Vá para Storage → Buckets</p>
                        <p>3. Clique em "New bucket"</p>
                        <p>4. Nome: "curriculos"</p>
                        <p>5. Marque "Public bucket"</p>
                        <p>6. File size limit: 10MB</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StorageInitializer;