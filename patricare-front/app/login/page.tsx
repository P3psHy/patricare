import React from 'react';
import Image from 'next/image';
import LoginForm from '../components/loginForm/LoginForm';

import Logo from '../assets/logo.png';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm">
        {/* En-tête avec Logo et Slogan */}
        <div className="text-center mb-4">
          <div className="flex justify-center mb-2">
            <div className="p-1 bg-white rounded-full shadow-lg">
              <Image src={Logo} alt="PatriCare Logo" width={42} height={42} />
            </div>
          </div>
          <h2 className="text-1xl font-bold text-gray-900">PatriCare</h2>
          <p className="mt-1 text-sm text-gray-600">
            Parce que chaque propriétaire mérite la sérénité.
          </p>
        </div>

        {/* Formulaire de Connexion */}
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
          <LoginForm />
        </div>

        {/* Pied de page */}
        <div className="mt-4 text-center text-sm text-gray-500">
          © 2025 PatriCare. À vos côtés pour valoriser vos biens.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;