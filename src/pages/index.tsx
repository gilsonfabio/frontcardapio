import Head from 'next/head'
import { LockClosedIcon } from '@heroicons/react/solid'
import { useForm } from 'react-hook-form'
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Image from 'next/image';
import Slideshow from '../components/SliderShow';

export default function Home() {
  const { register, handleSubmit } = useForm();
  const { signIn } = useContext(AuthContext)

  async function handleSignIn(data) {
    await signIn(data)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Home</title>
      </Head>
      <div className="grid grid-cols-1 gap-1 md:grid-cols-2 min-h-screen">  
      <div className='hidden md:block md:bg-gray-200'>
        <Slideshow />
      </div>
      <div className="bg-gray-100 flex flex-col items-center justify-center space-y-8">
        <div>          
          <Image src={'/images/logo-barra.png'} alt="Logo Pé de Cana" width={200} height={200} />
        </div>
        <div>          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">A MELHOR REDE SOCIAL, SEMPRE SERÁ UMA RODADA DE CERVEJA COM OS AMIGOS!</h2>
        </div>
        <div>          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Faça login na sua conta</h2>
        </div>
        <div className='w-1/2'>
        <form className="w-full space-y-6" onSubmit={handleSubmit(handleSignIn)}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="/ForgotPassword" className="font-medium text-indigo-600 hover:text-indigo-500">
                Esqueceu sua senha?
              </a>
            </div>      
          </div>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Endereço Email 
              </label>
              <input
                {...register('email')}
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Informe Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                {...register('password')}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Informe Senha"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
              </span>
              Entrar
            </button>
          </div>          
        </form>
        </div>
      </div>
      </div>
    </div>
  )
}
