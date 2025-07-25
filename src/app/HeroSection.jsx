import React from 'react';
import Image from 'next/image'


const HeroSection = (id = {HeroSection}) => {
    return (
        <section id = 'herosection' className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-center">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold text-indigo-950 leading-tight mb-4">
                            Sobre a RB recursos humanos
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed space-y-10">
                            Contratar a nossa empresa de RH é uma decisão inteligente para qualquer negócio que deseja crescer e se destacar no mercado.<br/><br/> Nós oferecemos soluções personalizadas e eficientes para recrutamento, seleção, treinamento e desenvolvimento de equipes, garantindo que sua empresa conte com os melhores talentos.<br/><br/> Nosso compromisso é entender as necessidades específicas do seu negócio e oferecer um serviço de alta qualidade, com ética, transparência e respeito.<br/><br/> Além disso, nossa experiência e dedicação ajudam a otimizar processos, reduzir custos e aumentar a produtividade, criando um ambiente de trabalho mais saudável e motivado.<br/><br/> Ao escolher a nossa empresa de RH, você investe na construção de uma equipe forte, alinhada aos valores da sua empresa, e no sucesso a longo prazo do seu negócio.
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <Image
                            src="/logo_ofc-preview.png"
                            alt="Logo da empresa"
                            width={500}
                            height={500}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;