'use client';
import React, { useState } from 'react';
import { User, Mail, Phone, FileText, Upload, Check, Send, Users, AlertCircle } from 'lucide-react';
import { supabase, candidateService, uploadFile, getPublicUrl, ensureBucketExists } from '../lib/supabase';

const CandidatoFormComponent = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        cidade: '',
        areaInteresse: '',
        nivelExperiencia: '',
        experiencia: '',
        curriculo: null,
        linkedin: '',
        aceiteTermos: false
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            // Verificar se o bucket de currículos existe
            const bucketExists = await ensureBucketExists('curriculos');
            if (!bucketExists) {
                throw new Error('Bucket de currículos não encontrado. Entre em contato com o suporte.');
            }

            let curriculoUrl = null;

            // Se há um currículo, fazer upload
            if (formData.curriculo) {
                // Gerar nome único para o arquivo
                const fileExtension = formData.curriculo.name.split('.').pop();
                const fileName = `${Date.now()}-${formData.nome.replace(/\s+/g, '-').toLowerCase()}.${fileExtension}`;

                console.log('Fazendo upload do currículo:', fileName);

                // Upload do arquivo
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('curriculos')
                    .upload(fileName, formData.curriculo);

                if (uploadError) {
                    throw new Error(`Erro no upload: ${uploadError.message}`);
                }

                if (uploadResult) {
                    // Obter URL pública do arquivo
                    curriculoUrl = getPublicUrl('curriculos', fileName);
                    console.log('URL do currículo:', curriculoUrl);
                }
            }

            // Preparar dados do candidato para o banco
            const candidateData = {
                nome: formData.nome,
                email: formData.email,
                telefone: formData.telefone,
                cidade: formData.cidade || null,
                area_interesse: formData.areaInteresse, // Note o underscore
                nivel_experiencia: formData.nivelExperiencia, // Note o underscore
                experiencia: formData.experiencia || null,
                curriculo_url: curriculoUrl, // Note o underscore
                linkedin: formData.linkedin || null,
                status: 'ativo'
            };

            console.log('Salvando candidato com dados:', candidateData);

            // Salvar candidato no banco
            const result = await candidateService.create(candidateData);

            if (result.error) {
                throw new Error(result.error.message || 'Erro ao salvar candidato');
            }

            console.log('Candidato salvo com sucesso:', result.data);
            setSubmitted(true);

            // Reset form after success
            setTimeout(() => {
                setSubmitted(false);
                setFormData({
                    nome: '',
                    email: '',
                    telefone: '',
                    cidade: '',
                    areaInteresse: '',
                    nivelExperiencia: '',
                    experiencia: '',
                    curriculo: null,
                    linkedin: '',
                    aceiteTermos: false
                });
                setShowForm(false); // Voltar para a tela inicial
            }, 4000);

        } catch (error) {
            console.error('Erro no cadastro:', error);
            setError(error.message || 'Erro ao realizar cadastro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Limpar erro quando usuário começar a digitar
        if (error) setError('');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Verificar tamanho (10MB)
            if (file.size > 10 * 1024 * 1024) {
                setError('Arquivo muito grande. O tamanho máximo é 10MB.');
                return;
            }

            // Verificar tipo de arquivo
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                setError('Tipo de arquivo não suportado. Use PDF, DOC ou DOCX.');
                return;
            }

            setFormData(prev => ({
                ...prev,
                curriculo: file
            }));
            setError(''); // Limpar erro se arquivo válido
        }
    };

    const isFormValid = () => {
        return formData.nome &&
            formData.email &&
            formData.telefone &&
            formData.areaInteresse &&
            formData.curriculo &&
            formData.aceiteTermos;
    };

    if (!showForm) {
        return (
            <section id='candidate' className='py-16 text-left bg-white'>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-indigo-950">Área do candidato</h2>
                            <div className="bg-white p-6">
                                <h3 className="text-xl font-semibold text-indigo-950 mb-2">Profissional</h3>
                                <p className="text-gray-600 mb-8">
                                    Crie seu perfil como profissional e encontre as melhores oportunidades de carreira.
                                </p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="flex py-2 px-4 w-70 items-center gap-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    <User size={24} />
                                    Cadastrar como Candidato
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <img
                                src="https://paraempresas.catho.com.br/wp-content/uploads/2020/09/perfil-do-candidato-1020x532.jpg"
                                alt="Profissionais trabalhando"
                                className="rounded-lg shadow-xl max-w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Botão de voltar */}
                <button
                    onClick={() => setShowForm(false)}
                    className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 mb-8 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Voltar
                </button>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                            <h3 className="text-red-800 font-semibold">Erro no cadastro</h3>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {submitted && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                        <Check className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                            <h3 className="text-green-800 font-semibold">Cadastro realizado com sucesso!</h3>
                            <p className="text-green-700">Você será notificado sobre vagas compatíveis com seu perfil.</p>
                        </div>
                    </div>
                )}

                {/* Form Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 rounded-full mb-8">
                        <Users className="text-yellow-600" size={48} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Cadastre-se como Candidato
                    </h1>
                    <p className="text-1xl text-gray-600 max-w-2xl mx-auto mb-8">
                        Tenha acesso às melhores oportunidades de trabalho.
                        Conecte-se com empresas de destaque e impulsione sua carreira profissional.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="space-y-6">
                        {/* Dados Pessoais */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User size={20} className="text-yellow-600" />
                                Dados Pessoais
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Nome Completo *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nome}
                                        onChange={(e) => handleInputChange('nome', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                                        placeholder="Seu nome completo"
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        <Mail className="inline mr-2" size={16} />
                                        E-mail *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                                        placeholder="seu@email.com"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        <Phone className="inline mr-2" size={16} />
                                        Telefone *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.telefone}
                                        onChange={(e) => handleInputChange('telefone', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                                        placeholder="(11) 99999-9999"
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Cidade
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.cidade}
                                        onChange={(e) => handleInputChange('cidade', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                                        placeholder="São Paulo - SP"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Informações Profissionais */}
                        <div className="pt-6 border-t border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText size={20} className="text-yellow-600" />
                                Informações Profissionais
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Área de Interesse *
                                    </label>
                                    <select
                                        value={formData.areaInteresse}
                                        onChange={(e) => handleInputChange('areaInteresse', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                                        disabled={loading}
                                    >
                                        <option value="">Selecione uma área</option>
                                        <option value="tecnologia">Tecnologia</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="vendas">Vendas</option>
                                        <option value="financeiro">Financeiro</option>
                                        <option value="recursos-humanos">Recursos Humanos</option>
                                        <option value="operacoes">Operações</option>
                                        <option value="design">Design</option>
                                        <option value="administracao">Administração</option>
                                        <option value="juridico">Jurídico</option>
                                        <option value="outros">Outros</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Nível de Experiência
                                    </label>
                                    <select
                                        value={formData.nivelExperiencia}
                                        onChange={(e) => handleInputChange('nivelExperiencia', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                                        disabled={loading}
                                    >
                                        <option value="">Selecione o nível</option>
                                        <option value="zero">Não possuo experiência</option>
                                        <option value="jovem-aprendiz">Jovem aprendiz</option>
                                        <option value="estagiario">Estagiário</option>
                                        <option value="junior">0-2 anos</option>
                                        <option value="pleno">3-5 anos</option>
                                        <option value="senior">6+ anos</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    LinkedIn (opcional)
                                </label>
                                <input
                                    type="url"
                                    value={formData.linkedin}
                                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                                    placeholder="https://linkedin.com/in/seuperfil"
                                    disabled={loading}
                                />
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Experiência Profissional
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.experiencia}
                                    onChange={(e) => handleInputChange('experiencia', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 resize-none"
                                    placeholder="Descreva brevemente sua experiência profissional, principais conquistas e habilidades..."
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Upload de Currículo */}
                        <div className="pt-6 border-t border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText size={20} className="text-yellow-600" />
                                Currículo *
                            </h3>

                            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${formData.curriculo
                                ? 'border-yellow-400 bg-yellow-50'
                                : 'border-gray-300 hover:border-yellow-400 hover:bg-yellow-50'
                                }`}>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="curriculo-upload"
                                    disabled={loading}
                                />
                                <label
                                    htmlFor="curriculo-upload"
                                    className={`cursor-pointer flex flex-col items-center ${loading ? 'pointer-events-none opacity-50' : ''}`}
                                >
                                    {formData.curriculo ? (
                                        <>
                                            <Check className="text-yellow-600 mb-3" size={48} />
                                            <p className="text-yellow-700 font-semibold mb-1">
                                                {formData.curriculo.name}
                                            </p>
                                            <p className="text-sm text-yellow-600">
                                                Arquivo carregado com sucesso! Clique para alterar.
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="text-gray-400 mb-3" size={48} />
                                            <p className="text-gray-700 font-semibold mb-1">
                                                Clique para anexar seu currículo
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Ou arraste e solte o arquivo aqui
                                            </p>
                                        </>
                                    )}
                                    <p className="text-xs text-gray-500 mt-2">
                                        Formatos aceitos: PDF, DOC, DOCX (máx. 10MB)
                                    </p>
                                </label>
                            </div>
                        </div>

                        {/* Terms and Submit */}
                        <div className="pt-6 border-t border-gray-100">
                            <div className="flex items-start gap-3 mb-6">
                                <input
                                    type="checkbox"
                                    id="aceiteTermos"
                                    checked={formData.aceiteTermos}
                                    onChange={(e) => handleInputChange('aceiteTermos', e.target.checked)}
                                    className="mt-1 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                                    disabled={loading}
                                />
                                <label htmlFor="aceiteTermos" className="text-sm text-gray-600">
                                    Eu concordo com os termos de uso e política de privacidade.
                                    Autorizo o uso dos meus dados para fins de recrutamento e seleção.
                                </label>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={!isFormValid() || loading}
                                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${isFormValid() && !loading
                                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Cadastrando...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        Cadastrar e Enviar Currículo
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidatoFormComponent;