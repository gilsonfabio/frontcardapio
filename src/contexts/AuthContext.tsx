import { createContext, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import Router from 'next/router'

import { api } from "../services/api";

type User = {
  idUsuario: number;
  nomUsuario: string;
  nivAcesso: number;
}

type SignInData = {
  email: string;
  password: string;
  tipaccess: number;
}

type AuthContextType = {
  isAuthenticated: boolean;
  user: User;
  signIn: (data: SignInData) => Promise<void>
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null)

  const isAuthenticated = !!user;

  useEffect(() => {

    destroyCookie({}, 'nextauth.token');
    destroyCookie({}, 'nextauth.usrId');
    destroyCookie({}, 'nextauth.usrNome');
    destroyCookie({}, 'nextauth.usrNivAcesso');
    destroyCookie({}, 'nextauth.refreshToken');

    //const { 'nextauth.token': token } = parseCookies()
    //if (token) {
    //  recoverUserInformation().then(response => {
    //    setUser(response.user)
    //  })
    //}
    
  }, [])

  async function signIn({ email, password, tipaccess }: SignInData) {
    api({
      method: 'post',    
      url: `signInCli`,
      data: {
        email,
        password
      },       
    }).then(function(response) {
      setCookie(undefined, 'nextauth.token', response.data.token, {maxAge: 60 * 60 * 1, })
      setCookie(undefined, 'nextauth.refreshToken', response.data.refreshToken, {maxAge: 60 * 60 * 1, })
      setCookie(undefined, 'nextauth.usrId', response.data.user.cliId, {maxAge: 60 * 60 * 1, })
      setCookie(undefined, 'nextauth.usrNome', response.data.user.cliNome, {maxAge: 60 * 60 * 1, })
      setCookie(undefined, 'nextauth.usrNivAcesso', response.data.user.cliPontos, {maxAge: 60 * 60 * 1, })
      
      api.defaults.headers['x-access-token'] = `${response.data.token}`;

      let idUsuario = response.data.user.cliId;
      let nomUsuario = response.data.user.cliNome;
      let nivAcesso = response.data.user.cliPontos;
      
      console.log(response.data)

      setUser(user)
      Router.push({
        pathname: '/dashboard',
      })
    }).catch(function(error) {
      alert(`Falha no login Clientes! Tente novamente. ${email}`);
    })    
  }
   
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}