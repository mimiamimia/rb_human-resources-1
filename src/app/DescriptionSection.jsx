import React from 'react';

// Componente DescriptionCard
const DescriptionCard = ({ image, title, description }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img 
                src={image} 
                alt={title}
                className="w-full h-auto object-cover"
            />
            <div className="p-6">
                <h3 className="text-xl font-semibold text-indigo-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

// Componente DescriptionSection
const DescriptionSection = () => {
    const cards = [
        {
            image: "https://i.pinimg.com/1200x/35/cf/02/35cf02096e18866a9dc4d217794df5d4.jpg",
            title: "Visão",
            description: "Ser reconhecida como parceira estratégica em Recrutamento, Seleção e Desenvolvimento de Pessoas, contribuindo para que empresas alcancem seus objetivos através de talentos certos, engajados e em constante evolução. Buscamos promover conexões humanas, éticas e duradouras, impulsionando o crescimento sustentável de nossos clientes e o desenvolvimento contínuo de profissionais."
        },
        {
            image: "https://i.pinimg.com/1200x/c8/43/8d/c8438dd30f7e98de64a9d4c32c598489.jpg",
            title: "Missão",
            description: "Atuar como parceira estratégica de empresas, oferecendo soluções personalizadas em Recrutamento, Seleção e Desenvolvimento de Pessoas, contribuindo para a construção de equipes qualificadas, engajadas e alinhadas aos objetivos organizacionais, fortalecendo o crescimento sustentável e a cultura corporativa."
        }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center  text-indigo-950 pb-8">Descrição</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {cards.map((card, index) => (
                        <DescriptionCard 
                            key={index}
                            image={card.image}
                            title={card.title}
                            description={card.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DescriptionSection;

