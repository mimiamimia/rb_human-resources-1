import React from 'react';
import Image from 'next/image';


const Header = () => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-16">
                    <Image
                        src="/logo_ofc-preview.png"
                        alt="Logo da empresa"
                        width={70}
                        height={70}
                    />
                    <ul className="hidden md:flex space-x-8 gap-16">
                        <li>
                            <a href="#herosection" className="text-gray-700 hover:text-gray-900 font-medium">
                                Início
                            </a>
                        </li>
                        <li>
                            <a href="#descriptionsection" className="text-gray-700 hover:text-gray-900 font-medium">
                                Sobre nós
                            </a>
                        </li>
                        <li>
                            <a href="#foundersection" className="text-gray-700 hover:text-gray-900 font-medium">
                                Fundadora
                            </a>
                        </li>
                        <li>
                            <a href="#registrationsection" className="text-gray-700 hover:text-gray-900 font-medium">
                                Sou uma empresa
                            </a>
                        </li>
                        <li>
                            <a href="#registrationsection" className="text-gray-700 hover:text-gray-900 font-medium">
                                Sou um candidato
                            </a>
                        </li>
                    </ul>
                </div>
                <button className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 font-medium">
                    Contato
                </button>
            </nav>
        </header>
    );
};

export default Header;