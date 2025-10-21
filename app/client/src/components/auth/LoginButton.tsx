import React from 'react';
import { useAuth } from '@/contexts/auth/useAuth';
import { Github } from 'lucide-react';

export default function LoginButton() {
  const { login } = useAuth();
  
  return (
    <div className='flex justify-center my-6 w-full max-w-sm mx-auto'>
    
      <button
        onClick={login}
        className='
          flex items-center justify-center gap-3 p-3 w-full
          bg-[#24292E] text-white font-semibold rounded-lg shadow-md
          transition-all duration-200 ease-in-out
          hover:bg-[#1A1F23] hover:shadow-lg
          active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-gray-400/50
          transform hover:translate-y-[-1px]
        '
       
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            login();
          }
        }}
      >
        <Github className='h-6 w-6 text-white' />

        <span>
          Continue with GitHub
        </span>
      </button>
    </div>
  );
}