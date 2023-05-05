import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import Link from "next/link";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import Menubar from "../components/Menubar";

const SearchFrmPagto = () => {
    const router = useRouter();
    const [url, setUrl] = useState('http://localhost:3333/files/upload/products/');
     
    const [idCli, setIdCliente] = useState(router.query.id);
    const [idPed, setPedId] = useState(router.query.pedId);

    const [frmpagto, setFrmPagto] = useState([]);

    const [frmId, setFrmId] = useState('');
    const [vlrTroco, setVlrTroco] = useState('');

    const [atualiza, setAtualiza] = useState(0);
          
    const {query: { id }, } = router;
    const {query: { pedId }, } = router;
      
    const { 'nextauth.token': token } = parseCookies();
    const { 'nextauth.refreshToken': refreshToken } = parseCookies();
    const { 'nextauth.usrId': idUsr } = parseCookies();
    const { 'nextauth.usrNome': nomUsr } = parseCookies();
    const { 'nextauth.usrNivAcesso': nivAcesso } = parseCookies();
    useEffect(() => {
        api({
            method: 'get',    
            url: `/frmPagto`,
            headers: {
                "x-access-token" : token    
            },      
        }).then(function(resp) {
            console.log(resp.data)
            setFrmPagto(resp.data);
        }).catch(function(error) {  
            handleRefreshToken()               
        })         
    }, [])

    async function handleRefreshToken(){
        await api({
            method: 'post',    
            url: `refreshToken`,
            data: {
                idUsr,                            
            },
            headers: {
                "x-access-token" : refreshToken    
            },      
        }).then(function(response) {
            destroyCookie({}, 'nextauth.token');
            destroyCookie({}, 'nextauth.usrId');
            destroyCookie({}, 'nextauth.usrNome');
            destroyCookie({}, 'nextauth.usrNivAcesso');
            destroyCookie({}, 'nextauth.refreshToken'); 
            
            setCookie(undefined, 'nextauth.token', response.data.token, {maxAge: 60 * 60 * 1, })
            setCookie(undefined, 'nextauth.refreshToken', response.data.refreshToken, {maxAge: 60 * 60 * 1, })
            setCookie(undefined, 'nextauth.usrId', response.data.user.usrId, {maxAge: 60 * 60 * 1, })
            setCookie(undefined, 'nextauth.usrNome', response.data.user.usrNome, {maxAge: 60 * 60 * 1, })
            setCookie(undefined, 'nextauth.usrNivAcesso', response.data.user.usrNivAcesso, {maxAge: 60 * 60 * 1, })                
            setAtualiza(atualiza + 1 )
        }).catch(function(error) {
            alert(`Falha no token de acesso dos produtos`);
            Router.push({
                pathname: '/',        
            })      
        })
    }
    useEffect(() => {
        api({
            method: 'get',    
            url: `/frmPagto`,
            headers: {
                "x-access-token" : token    
            },      
        }).then(function(response) {
            console.log(response.data)
            setFrmPagto(response.data);
        }).catch(function(error) {  
            alert(`Falha no token de acesso as Formas de Pagto`);   
        }) 
    }, [atualiza])
    
    return (
        <section className='flex items-center justify-center w-screen h-screen gradient-form'>
      <div className='py-12 px-6 h-full w-full'>
        <div className=' flex justify-center items-center flex-wrap h-full g-6 text-gray-800'>
          <div className='w-full'>
            <div className='bg-gray-200 shadow-lg rounded-lg'>
              <div className='lg:flex lg:flex-wrap g-0'>
                <div className='px-4 md:px-0'>
                  <div className='md:p-12 md:mx-6'>
                    <div className='text-center'>
                      <h4 className='text-xl font-semibold mt-1 mb-12 pb-1'>
                        Formulário Forma de Pagamentos
                      </h4>
                    </div>
                    <form className='w-full h-auto ml-5 mr-5 '>                       
                      
                      <div className='mb-4'> 
                        <select className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example" 
                          value={frmId}
                          onChange={(e) => {setFrmId(e.target.value)}} 
                        >
                          <option selected>Selecione a Forma de Pagto desejado</option>
                          {frmpagto.map((row) => (
                            <option key={row.frmId} value={row.frmId}>{row.frmDescricao}</option>
                          ))}                          
                        </select>             
                      </div>
                      <div className='mb-4'>                        
                        <input 
                          type='text'
                          disabled={frmId === '1' ? false : true}
                          className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                          placeholder='Troco'
                          name='vlrTroco'
                          value={vlrTroco} 
                          onChange={(e) => {setVlrTroco(e.target.value)}} 
                        />
                      </div> 
                     
                      <div className='text-center pt-1 mb-12 pb-1'>
                        <button
                          className='bg-green inline-block px-6 py-2.5 text-black hover:text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3'
                          type='button'
                          onClick={() => {}}
                        >
                          Selecionado
                        </button>
                      </div>                      
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    );
}

export default SearchFrmPagto;