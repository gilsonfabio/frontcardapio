import React, {useState, useEffect}  from 'react';
import Router, { useRouter } from "next/router";
import { setCookie, parseCookies, destroyCookie } from 'nookies'

import { api } from "../services/api";

const NewEndereco = () => {
    const router = useRouter();
    const [endCliId ,setEndCliId] = useState(router.query.cliId);
    const [endLogradouro ,setEndLogradouro] = useState(''); 
    const [endNumero ,setEndNumero] = useState(''); 
    const [endComplemento ,setEndComplemento] = useState('');
    const [endBairro ,setEndBairro] = useState('');
    const [endCidade ,setEndCidade] = useState(''); 
    const [endEstado ,setEndEstado] = useState(''); 
    const [endCep ,setEndCep] = useState(''); 
    const [endLatitude ,setEndLatitude] = useState(''); 
    const [endLongitude ,setEndLongitude] = useState(''); 
    const [endLatitudeDelta ,setEndLatitudeDelta] = useState(''); 
    const [endLongitudeDelta ,setEndLongitudeDelta] = useState('');
    const [endStatus ,setEndStatus] = useState('A');
    const [atualiza, setAtualiza] = useState(0);

    const [bairros, setBairros] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [estados, setEstados] = useState([]);

    const {query: { cliId }, } = router;

    const { 'nextauth.token': token } = parseCookies();
    const { 'nextauth.refreshToken': refreshToken } = parseCookies();
    const { 'nextauth.usrId': idUsr } = parseCookies();
    const { 'nextauth.usrNome': nomUsr } = parseCookies();
    const { 'nextauth.usrNivAcesso': nivAcesso } = parseCookies();

    useEffect(() => {
        api({
            method: 'get',    
            url: `/bairros`,
            headers: {
                "x-access-token" : token    
            },      
        }).then(function(response) {
            console.log(response.data)
            setBairros(response.data);
        }).catch(function(error) {  
            alert(`Falha no token de acesso dos bairros`);   
        }) 

        api({
            method: 'get',    
            url: `/cidades`,
            headers: {
                "x-access-token" : token    
            },      
        }).then(function(response) {
            console.log(response.data)
            setCidades(response.data);
        }).catch(function(error) {  
            alert(`Falha no token de acesso das cidades`);   
        }) 

        api({
            method: 'get',    
            url: `/estados`,
            headers: {
                "x-access-token" : token    
            },      
        }).then(function(response) {
            console.log(response.data)
            setEstados(response.data);
        }).catch(function(error) {  
            alert(`Falha no token de acesso dos estados`);   
        }) 
        
    }, [])

    async function handleCadastra(e:any){      
        e.preventDefault();

        api({
            method: 'post',    
            url: `newendereco`,
            data: {
                endCliId,
                endLogradouro, 
                endNumero, 
                endComplemento,
                endBairro, 
                endCidade, 
                endEstado, 
                endCep, 
                endLatitude, 
                endLongitude, 
                endLatitudeDelta, 
                endLongitudeDelta,
                endStatus                      
            },
            headers: {
                "x-access-token" : token    
            },      
        }).then(function(response) {
            alert('Endereço cadastrado com sucesso!')
        }).catch(function(error) {
            handleRefreshToken()          
        })
    }

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
          handleCadastra
      }).catch(function(error) {
          alert(`Falha no token de cadastro de enderecos`);
          Router.push({
              pathname: '/',        
          })      
      })
    }

    useEffect(() => {
        api({
            method: 'get',    
            url: `/bairros`,
            headers: {
                "x-access-token" : token    
            },      
        }).then(function(response) {
            console.log(response.data)
            setBairros(response.data);
        }).catch(function(error) {  
            alert(`Falha no token de acesso dos bairros`);   
        }) 

        api({
            method: 'get',    
            url: `/cidades`,
            headers: {
                "x-access-token" : token    
            },      
        }).then(function(response) {
            console.log(response.data)
            setCidades(response.data);
        }).catch(function(error) {  
            alert(`Falha no token de acesso das cidades`);   
        }) 

        api({
            method: 'get',    
            url: `/estados`,
            headers: {
                "x-access-token" : token    
            },      
        }).then(function(response) {
            console.log(response.data)
            setEstados(response.data);
        }).catch(function(error) {  
            alert(`Falha no token de acesso dos estados`);   
        }) 
        
    }, [atualiza])

    function handleNewBairro(){
        Router.push({
          pathname: '/NewBairro',       
        })        
    }

    function handleNewCidade(){
        Router.push({
          pathname: '/NewCidade',       
        })        
    }

    function handleNewEstado(){
        Router.push({
          pathname: '/NewEstado',       
        })                
    }

    return (
    <section className='flex items-center justify-center w-screen h-screen gradient-form bg-gray-200'>
      <div className='py-12 px-6 h-full w-full'>
        <div className=' flex justify-center items-center flex-wrap h-full g-6 text-gray-800'>
          <div className='w-full'>
            <div className='bg-gray-200 shadow-lg rounded-lg'>
              <div className='lg:flex lg:flex-wrap g-0'>
                <div className='px-4 md:px-0'>
                  <div className='md:p-12 md:mx-6'>
                    <div className='text-center'>
                      <h4 className='text-xl font-semibold mt-1 mb-12 pb-1'>
                        Formulário Cadastro de Endereços
                      </h4>
                    </div>
                    <form className='w-full h-auto ml-5 mr-5 '>                       
                      <div className='mb-4'>                        
                        <input
                          type='text'
                          className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                          placeholder='Logradouro'
                          name='endLogradouro'
                          value={endLogradouro} 
                          onChange={(e) => {setEndLogradouro(e.target.value)}} 
                        />
                      </div>
                      <div className='mb-4'>                        
                        <input
                          type='text'
                          className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                          placeholder='Numero'
                          name='endNumero'
                          value={endNumero} 
                          onChange={(e) => {setEndNumero(e.target.value)}} 
                        />
                      </div>                      
                      <div className='mb-4'>                        
                        <input
                          type='text'
                          className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                          placeholder='Complemento'
                          name='endComplemento'
                          value={endComplemento} 
                          onChange={(e) => {setEndComplemento(e.target.value)}} 
                        />
                      </div> 
                      <div className='mb-4'> 
                        <select className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example" 
                          value={endBairro}
                          onChange={(e) => {setEndBairro(e.target.value)}} 
                        >
                          <option selected>Selecione o Bairro desejado</option>
                          {bairros.map((row) => (
                            <option key={row.baiId} value={row.baiId}>{row.baiDescricao}</option>
                          ))}                          
                        </select>             
                      </div>
                      <button onClick={handleNewBairro} className='cursor-pointer'>
                         <span className='text-blue-600 font-bold text-xs hover:text-blue-800'>novo bairro</span>       
                      </button>
                      <div className='mb-4'> 
                        <select className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example" 
                          value={endCidade}
                          onChange={(e) => {setEndCidade(e.target.value)}} 
                        >
                          <option selected>Selecione a Cidade desejada</option>
                          {cidades.map((row) => (
                            <option key={row.cidId} value={row.cidId}>{row.cidDescricao}</option>
                          ))}                          
                        </select>             
                      </div>
                      <button onClick={handleNewCidade} className='cursor-pointer'>
                         <span className='text-blue-600 font-bold text-xs hover:text-blue-800'>nova cidade</span>       
                      </button>
                      <div className='mb-4'> 
                        <select className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example" 
                          value={endEstado}
                          onChange={(e) => {setEndEstado(e.target.value)}} 
                        >
                          <option selected>Selecione o Estado desejado</option>
                          {estados.map((row) => (
                            <option key={row.ufId} value={row.ufId}>{row.ufCod}</option>
                          ))}                          
                        </select>             
                      </div>                     
                      <button onClick={handleNewEstado} className='cursor-pointer'>
                         <span className='text-blue-600 font-bold text-xs hover:text-blue-800'>novo estado</span>       
                      </button>          
                      <div className='mb-4'>                        
                        <input
                          type='text'
                          className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                          placeholder='Cep'
                          name='endCep'
                          value={endCep} 
                          onChange={(e) => {setEndCep(e.target.value)}} 
                        />
                      </div>
                      <div className='mb-4'>                        
                        <input
                          type='text'
                          className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                          placeholder='Latitude'
                          name='endLatitude'
                          value={endLatitude} 
                          onChange={(e) => {setEndLatitude(e.target.value)}} 
                        />
                      </div>
                      <div className='mb-4'>                        
                        <input
                          type='text'
                          className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                          placeholder='Longitude'
                          name='endLongitude'
                          value={endLongitude} 
                          onChange={(e) => {setEndLongitude(e.target.value)}} 
                        />
                      </div>
                      <div className='mb-4'>                        
                        <input
                          type='text'
                          className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                          placeholder='LatitudeDelta'
                          name='endLatitudeDelta'
                          value={endLatitudeDelta} 
                          onChange={(e) => {setEndLatitudeDelta(e.target.value)}} 
                        />
                      </div>
                      <div className='mb-4'>                        
                        <input
                          type='text'
                          className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                          placeholder='LongitudeDelta'
                          name='endLongitudeDelta'
                          value={endLongitudeDelta} 
                          onChange={(e) => {setEndLongitudeDelta(e.target.value)}} 
                        />
                      </div>
                      <div className='text-center pt-1 mb-12 pb-1'>
                        <button
                          className='bg-green inline-block px-6 py-2.5 text-black hover:text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3'
                          type='button'
                          onClick={handleCadastra}
                        >
                          Cadastrar
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
};
export default NewEndereco;