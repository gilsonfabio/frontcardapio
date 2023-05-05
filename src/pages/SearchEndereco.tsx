import React, { useState, useEffect, useRef } from "react";
import { api } from "../services/api";
import Link from "next/link";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import Menubar from "../components/Menubar";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

interface pedidosProps {
    pedId: number;
    pedData: string; 
    pedCliId: number; 
    pedQtdTotal: number; 
    pedVlrTotal: number; 
    pedCupom: string; 
    pedVlrPagar: number;                 
    pedEndEntrega: number;
    pedVlrTaxEntrega: number; 
    pedFrmPagto: number;
    pedStatus: string;
    pedUltItem: number;
}

interface enderecosProps {
    endId: number;
    endCliId: number;
    endLogradouro: string; 
    endNumero: string; 
    endComplemento: string; 
    endBairro: number;  
    endCidade: number;  
    endEstado: number;  
    endCep: string;  
    endLatitude: string;  
    endLongitude: string;  
    endLatitudeDelta: string;  
    endLongitudeDelta: string; 
    endStatus: string; 
    baiDescricao: string;
    cidDescricao: string;
    ufCod: string;
}

const containerStyle = {
    width: '1200px',
    height: '700px'
};

const SearchEndereco = () => {
    const router = useRouter();
    const [pedidos, setPedidos] = useState<Array<pedidosProps>>([]);
    const [enderecos, setEnderecos] = useState<Array<enderecosProps>>([]);
    const [url, setUrl] = useState('http://localhost:3333/files/upload/products/');
     
    const [idCli, setIdCliente] = useState(router.query.id);
    const [idPed, setPedId] = useState(router.query.pedId);

    const [atualiza, setAtualiza] = useState(0);
          
    const {query: { id }, } = router;
    const {query: { pedId }, } = router;
    
    const [map, setMap] = useState(null);
    
    //let center = {
    //    lat: -16.670983626595493,
    //    lng: -49.24491971888687
    //};

    const [lat, setLat] = useState(-16.670983626595493);
    const [lng, setLng] = useState(-49.24491971888687);
      
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyAoBRh-o-qRQCKO3dCJLz5unCpnTPpkes8"
    })

    const { 'nextauth.token': token } = parseCookies();
    const { 'nextauth.refreshToken': refreshToken } = parseCookies();
    const { 'nextauth.usrId': idUsr } = parseCookies();
    const { 'nextauth.usrNome': nomUsr } = parseCookies();
    const { 'nextauth.usrNivAcesso': nivAcesso } = parseCookies();

    useEffect(() => {
        api({
            method: 'get',    
            url: `/enderecos/${idCli}`,
            headers: {
                "x-access-token" : token    
            },      
        }).then(function(resp) {
            console.log(resp.data)
            setEnderecos(resp.data);
        }).catch(function(error) {  
                          
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
        if (atualiza > 0) {
            const { 'nextauth.token': token } = parseCookies();
            const { 'nextauth.refreshToken': refreshToken } = parseCookies();
            const { 'nextauth.usrId': idUsr } = parseCookies();
            const { 'nextauth.usrNivAcesso': nivAcesso } = parseCookies();
              
            api({
                method: 'get',    
                url: `/enderecos/${idCli}`,
                headers: {
                    "x-access-token" : token    
                },      
            }).then(function(resp) {
                console.log(resp.data)
                setEnderecos(resp.data);
            }).catch(function(error) {  
                alert(`Falha no token de acesso dos endereços`);   
            })            
        }
    }, [atualiza, lat, lng])
    
    async function atualizaLocalização() {
        navigator.geolocation.getCurrentPosition( location => {
            //console.log(location);
            console.log('Latitude: ',location.coords.latitude);
            console.log('Longitude: ',location.coords.longitude);
            setLat(location.coords.latitude);
            setLng(location.coords.longitude);
            setAtualiza(atualiza + 1 );
            console.log('Nova localização no mapa:',lat, lng);            
        });
    }

    function handleNewEndereco(){
        Router.push({
          pathname: '/NewEndereco',       
        })        
    }

    function handleSelEndereco(row){
        let pedEndEntrega = row.endId;
        api({
            method: 'put',    
            url: `/updEndPedido`,
            data: {
                idPed,
                pedEndEntrega
            },
            headers: {
                "x-access-token" : token    
            },      
        }).then(function(resp) {
            alert(`Endereço atualizado no pedido!`);    
        }).catch(function(error) {  
            alert(`Falha no token de acesso dos endereços`);   
        }) 
        Router.push({
          pathname: '/SearchFrmPagto',       
        })        
    }

    return (
        <div className="h-auto w-screen">
            <div className='flex flex-col w-full '>
                <Menubar />
            </div>
            <div className="flex flex-row justify-between items-center w-full h-auto bg-gray-200 ">
                <span className="text-3xl font-bold text-green-600 mt-6 ml-28 mb-6" >
                    Endereços cadastrados
                </span> 
                <div className="w-auto h-auto">
                    <button onClick={handleNewEndereco}> 
                        <div className="md:mr-28 border border-green-700 rounded-md p-2 text-green-600 hover:text-white hover:bg-green-600 hover:cursor-pointer text-sm md:text-[10px] w-auto h-auto md:w-auto md:h-auto flex">
                            Novo Endereço 
                        </div>
                    </button>
                                                         
                </div>               
            </div>
            <div className="md:ml-28 md:mr-28">
                <div className="p-2 grid grid-cols-1 gap-1 md:grid-cols-4 md:gap-2 md:mt-3 ">  
                    {enderecos?.map((row, idx) => ( 
                        <div key={idx} className="h-auto rounded overflow-hidden shadow-2xl mb-5 w-full " > 
                            <div className="flex flex-row w-full h-full">                            
                                <div className="flex w-full h-full">
                                    <div className="flex flex-col items-center justify-start w-full h-full">   
                                        <div className="w-full ml-5 flex flex-row text-gray-700 text-xs font-bold" >
                                            {row.endLogradouro},{row.endNumero}
                                        </div>
                                        <div className="w-full ml-5 flex flex-row text-gray-700 text-xs" >
                                            {row.endComplemento}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-start w-full h-full">   
                                        <div className="w-full ml-5 flex flex-row text-gray-700 text-xs font-bold" >
                                            {row.baiDescricao}
                                        </div>
                                        <div className="w-full ml-5 flex flex-row text-gray-700 text-xs" >
                                            {row.cidDescricao} - {row.ufCod}
                                        </div>
                                    </div>                               
                                    <div className="w-full ml-5 flex flex-row text-gray-700 text-xs font-bold" >
                                        {row.endCep}
                                    </div>
                                    <div className="flex flex-col items-center w-full h-auto">
                                        <button onClick={() => handleSelEndereco(row)}> 
                                            <div className="border border-green-700 rounded-md p-2 text-green-600 hover:text-white hover:bg-green-600 hover:cursor-pointer text-sm md:text-[10px] w-auto h-auto md:w-auto md:h-auto flex">
                                                Selecione 
                                            </div>
                                        </button>                                     
                                    </div>
                                </div>                            
                            </div>
                        </div>                                             
                    ))}
                </div>
                <div>
                <button 
                    className='md:mr-28 border border-green-700 rounded-md p-2 text-green-600 hover:text-white hover:bg-green-600 hover:cursor-pointer text-sm md:text-[10px] w-auto h-auto md:w-auto md:h-auto flex'
                    onClick={atualizaLocalização}>
                    Show Location {lat} {lng}
                </button>
                {isLoaded ? 
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={{ lat: lat, lng: lng }}
                        zoom={10}                        
                    > 
                    <Marker position={{ lat: lat, lng: lng }} />
                    </GoogleMap>
                : <></>}
            </div>
            </div>            
        </div>   
    );
}

export default SearchEndereco;