import React from 'react';


const Header = () => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-16">

                    <ul className="hidden md:flex space-x-8 gap-16">
                        <li>
                            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                                Início
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                                Sobre nós
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                                Vagas
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