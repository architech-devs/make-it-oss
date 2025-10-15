// import { useAuth } from "@/contexts/auth/useAuth";

// const LoginButton = () => {
//   const { login } = useAuth();
//   return (
//     <button
//       onClick={login}
//       className="bg-gray-900 text-white px-4 py-2 rounded flex items-center gap-2"
//     >
//       <img src="/github-icon.svg" alt="GitHub" width={20} />
//       Login with GitHub
//     </button>
//   );
// };

// export default LoginButton;

import React from 'react';
import { useAuth } from '@/contexts/auth/useAuth';
import { Github } from 'lucide-react';

export default function LoginButton() {
  const { login } = useAuth();
  return <div className='flex-col gap-2 my-5 justify-items-end'>
    
    
     <div><button  onClick={login}><Github/></button></div>
    <div className='text-xs text-gray-500 text-right'>Login with
      <br/> GitHub</div>
   
    </div>;
}

