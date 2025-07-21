'use client';
import React, { useState } from 'react';
import { User, Mail, Phone, FileText, Upload, Check, Send, MapPin, Award } from 'lucide-react';
const CandidatoRegistrationForm = () => {
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

    const handleSubmit = async () => {
        setLoading(true);

        // Simula envio do formulário
        setTimeout(() => {
            console.log('Dados do candidato:', {
                ...formData,
                curriculoName: formData.curriculo?.name
            });
            setSubmitted(true);
            setLoading(false);

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
            }, 4000);
        }, 2000);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
            setFormData(prev => ({
                ...prev,
                curriculo: file
            }));
        } else if (file) {
            alert('Arquivo muito grande. O tamanho máximo é 5MB.');
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">


                {/* Success Message */}
                {submitted && (
                    <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-6 flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <Check className="text-green-600 bg-green-100 rounded-full p-1" size={24} />
                        </div>
                        <div>
                            <h3 className="text-green-800 font-semibold">Cadastro realizado com sucesso!</h3>
                            <p className="text-green-700">Você será notificado sobre vagas compatíveis com seu perfil.</p>
                        </div>
                    </div>
                )}

                {/* Form Card */}
                <label className='peer'>
                    <button type='submit' className=' bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 font-medium'>Sou candidato</button>
                </label>
                {/* Header */}
                <div className="hidden peer-has-clicked:flex text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
                        <User className="text-purple-600" size={40} />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Cadastro de Candidato
                    </h1>
                    <p className="text-xl text-gray-600 max-w-xl mx-auto">
                        Cadastre-se em nossa plataforma e tenha acesso às melhores oportunidades de trabalho
                    </p>
                </div>
                <div className="hidden transition-all transition-discrete not-peer-has-checked:opacity-0 peer-has-checked:block bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="space-y-6">
                        {/* Dados Pessoais */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User size={20} className="text-purple-600" />
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                        placeholder="Seu nome completo"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                        placeholder="seu@email.com"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        <MapPin className="inline mr-2" size={16} />
                                        Cidade
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.cidade}
                                        onChange={(e) => handleInputChange('cidade', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                        placeholder="São Paulo - SP"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Informações Profissionais */}
                        <div className="pt-6 border-t border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Award size={20} className="text-purple-600" />
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                    >
                                        <option value="">Selecione o nível</option>
                                        <option value="estagiario">Estagiário</option>
                                        <option value="junior">Júnior (0-2 anos)</option>
                                        <option value="pleno">Pleno (3-5 anos)</option>
                                        <option value="senior">Sênior (6+ anos)</option>
                                        <option value="coordenador">Coordenador/Líder</option>
                                        <option value="gerente">Gerente</option>
                                        <option value="diretor">Diretor</option>
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                    placeholder="https://linkedin.com/in/seuperfil"
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none"
                                    placeholder="Descreva brevemente sua experiência profissional, principais conquistas e habilidades..."
                                />
                            </div>
                        </div>

                        {/* Upload de Currículo */}
                        <div className="pt-6 border-t border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText size={20} className="text-purple-600" />
                                Currículo *
                            </h3>

                            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${formData.curriculo
                                ? 'border-purple-400 bg-purple-50'
                                : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                                }`}>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="curriculo-upload"
                                />
                                <label
                                    htmlFor="curriculo-upload"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    {formData.curriculo ? (
                                        <>
                                            <Check className="text-purple-600 mb-3" size={48} />
                                            <p className="text-purple-700 font-semibold mb-1">
                                                {formData.curriculo.name}
                                            </p>
                                            <p className="text-sm text-purple-600">
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
                                        Formatos aceitos: PDF, DOC, DOCX (máx. 5MB)
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
                                    className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <label htmlFor="aceiteTermos" className="text-sm text-gray-600">
                                    Eu concordo com os <a href="#" className="text-purple-600 underline">termos de uso</a> e
                                    <a href="#" className="text-purple-600 underline"> política de privacidade</a>.
                                    Autorizo o uso dos meus dados para fins de recrutamento e seleção.
                                </label>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={!isFormValid() || loading}
                                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${isFormValid() && !loading
                                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
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

export default CandidatoRegistrationForm;