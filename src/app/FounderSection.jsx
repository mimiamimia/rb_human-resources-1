import React from 'react';

const FounderSection = () => {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div className="flex flex-col items-center lg:items-start space-y-6">
                        <h2 className="text-3xl font-bold text-indigo-950 pb-8">Fundadora</h2>
                        
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-indigo-950">Elizabeth Gomes</h3>
                        <p className="text-lg text-indigo-950 font-medium py-4">CEO</p>
                        <div className="prose prose-gray max-w-none">
                            <p className="text-gray-700 leading-relaxed text-justify">
                                Sou profissional de Recursos Humanos, com sólida experiência como Consultora e Analista de RH, atuando em projetos estratégicos voltados para a gestão de pessoas. Minha trajetória é marcada por uma atuação abrangente em Recrutamento e Seleção, Treinamento e Desenvolvimento, Avaliação de Desempenho, Clima Organizacional e Suporte a Lideranças.<br/> <br/>
                                Tenho forte expertise na identificação e atração de talentos, conduzindo processos seletivos por competências e garantindo uma integração eficaz de novos colaboradores, sempre alinhando as práticas de RH às necessidades e objetivos da organização.<br/><br/>
                                Além disso, atuo diretamente na estruturação de programas de desenvolvimento, elaboração de trilhas de aprendizagem, avaliação de performance e iniciativas de fortalecimento da cultura organizacional. Também possuo experiência em planos de cargos e salários, estratégias de retenção de talentos e mediação de conflitos.<br/><br/>
                                Sou reconhecida pelo perfil analítico, orientado a resultados, com escuta ativa, excelente relacionamento interpessoal e postura ética, sempre em conformidade com a legislação trabalhista.<br/><br/>
                                Atualmente, amplio minha formação com uma pós-graduação em Treinamento e Desenvolvimento, além de cursos de extensão em áreas como Comunicação nas Organizações, Mediação de Conflitos, Estratégias de Negociação e Oratória, buscando evolução contínua para gerar cada vez mais valor para equipes e organizações.<br/><br/>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FounderSection;