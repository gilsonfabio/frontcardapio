import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import Link from "next/link";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import Menubar from "../components/Menubar";


interface pedidosProps {
    itePedId: number; 
    itePedItem: number; 
    itePedProId: number;
    itePedQtde: number;
    itePedVlrUnit: number;
    itePedVlrTotal: number;
    prdUrlPhoto: string;
    prdDescricao: string;
    prdReferencia: string;
}

interface productsProps {
    prdId: number; 
    prdDescricao: string; 
    prdReferencia: string;
    prdGrupo: number;
    prdLinha: number;
    prdCstUnitario: number;
    prdVdaUnitario: number;
    prdQtdEstoque: number;
    prdDscPermitido: number;
    prdStatus: string;
    prdUrlPhoto: string;
    grpDescricao: string;
    lnhDescricao: string;
}

const CartShopping = () => {
    const router = useRouter();
    const [pedidos, setPedidos] = useState<Array<pedidosProps>>([]);
    const [url, setUrl] = useState('http://localhost:3333/files/upload/products/');

    const [codCupom, setCodCupom] = useState('');
    
    const [idPro, setIdPro] = useState(0);
    const [ids, setIds] = useState<Array<number>>([]);
    const [idsPro, setIdsPro] = useState<Array<number>>([]);
    const [countItens, setCountItens] = useState(0);
    const [idUsrCar, setIdUsrCar] = useState();

    const [idPed, setIdPed] = useState(router.query.id);
    const [atualiza, setAtualiza] = useState(0);
          
    const {query: { id }, } = router;
    const {query: { nivAce }, } = router;
      
    const { 'nextauth.token': token } = parseCookies();
    const { 'nextauth.refreshToken': refreshToken } = parseCookies();
    const { 'nextauth.usrId': idUsr } = parseCookies();
    const { 'nextauth.usrNome': nomUsr } = parseCookies();
    const { 'nextauth.usrNivAcesso': nivAcesso } = parseCookies();

    useEffect(() => {
        api({
            method: 'get',    
            url: `/itePedido/${idPed}`,
            headers: {
                "x-access-token" : token    
            },      
        }).then(function(resp) {
            console.log(resp.data)
            setPedidos(resp.data);
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
                url: `/itePedido/${idPed}`,
                headers: {
                    "x-access-token" : token    
                },      
            }).then(function(resp) {
                console.log(resp.data)
                setPedidos(resp.data);
            }).catch(function(error) {  
                alert(`Falha no token de acesso dos produtos`);   
            }) 
        }
    }, [atualiza])
    
    function handleEndereço(){
        Router.push({
          pathname: '/SearchEndereco',
          query: { id: `${idUsr}`, pedId:`${idPed} `}        
        })        
    }

    async function handleAdiItem(row) {
        try {
              const selectedId = parseInt(row.prdId);
              setIdPro(selectedId) ;
              const newPro = [...idsPro];
              newPro.push(selectedId);
              setIds(newPro);      
              setIdsPro(newPro);
              setCountItens(countItens + 1);
              console.log(countItens);
            } catch (err) {
                alert('Erro ao adicionar produto!');
            } 
            
            let data = new Date();
            let dia = data.getDate();
            let mes = data.getMonth() + 1;
            let ano = data.getFullYear();
            let hor = data.getHours();
            let min = data.getMinutes();
            let seg = data.getSeconds();
            let dataString = ano + '-' + mes + '-' + dia + ' ' + hor + ':' + min + ':' + seg ;
            let dataAtual = dataString;
    
            let qtdProd = 1;
            let endEntrega = '';
            let taxEntrega = '';
            let frmPagto = '';
            let ultItem = '';
    
            api({
                method: 'post',    
                url: `newprocar`,
                data: {
                    pedId: idPed,
                    pedData: dataAtual, 
                    pedCliId: idUsr, 
                    pedQtdTotal: qtdProd, 
                    pedVlrTotal: row.prdVdaUnitario, 
                    pedCupom: codCupom, 
                    pedVlrPagar: row.prdVdaUnitario, 
                    pedEndEntrega: endEntrega,
                    pedVlrTaxEntrega: taxEntrega, 
                    pedFrmPagto: frmPagto, 
                    pedUltItem: ultItem,
                    itePedProId: row.itePedProId, 
                    itePedQtde: qtdProd, 
                    itePedVlrUnit: row.itePedVlrUnit
                },
                headers: {
                    "x-access-token" : token    
                },      
            }).then(function(response) {
                alert(`Produto incluido com sucesso!,${response.data}`)
                setAtualiza(atualiza + 1)
            }).catch(function(error) {                
                alert('Erro na inclusão!');
            })        
    }

    async function handleSubItem(row) {
        try {
              const selectedId = parseInt(row.prdId);
              setIdPro(selectedId) ;
              const newPro = [...idsPro];
              newPro.push(selectedId);
              setIds(newPro);      
              setIdsPro(newPro);
              setCountItens(countItens - 1);
              console.log(countItens);
            } catch (err) {
                alert('Erro ao adicionar produto!');
            } 
            
            let data = new Date();
            let dia = data.getDate();
            let mes = data.getMonth() + 1;
            let ano = data.getFullYear();
            let hor = data.getHours();
            let min = data.getMinutes();
            let seg = data.getSeconds();
            let dataString = ano + '-' + mes + '-' + dia + ' ' + hor + ':' + min + ':' + seg ;
            let dataAtual = dataString;
    
            let qtdProd = 1;
            let endEntrega = '';
            let taxEntrega = '';
            let frmPagto = '';
            let ultItem = '';
    
            api({
                method: 'put',    
                url: `subprocar`,
                data: {
                    pedId: idPed,
                    pedData: dataAtual, 
                    pedCliId: idUsr, 
                    pedQtdTotal: qtdProd, 
                    pedVlrTotal: row.prdVdaUnitario, 
                    pedCupom: codCupom, 
                    pedVlrPagar: row.prdVdaUnitario, 
                    pedEndEntrega: endEntrega,
                    pedVlrTaxEntrega: taxEntrega, 
                    pedFrmPagto: frmPagto, 
                    pedUltItem: ultItem,
                    itePedProId: row.itePedProId, 
                    itePedQtde: qtdProd, 
                    itePedVlrUnit: row.itePedVlrUnit
                },
                headers: {
                    "x-access-token" : token    
                },      
            }).then(function(response) {
                alert(`Produto subtraido com sucesso!,${response.data}`)
                setAtualiza(atualiza + 1)
            }).catch(function(error) {                
                alert('Erro na subtração!');
            })        
    }
    
    return (
        <div className="flex flex-col h-auto w-full">
            <div className='flex flex-col w-full '>
                <Menubar />
            </div>
            <div className="flex flex-row justify-between items-center ">
                <span className="flex flex-row justify-center items-center text-3xl font-bold text-green-600 mt-6 ml-2 mb-6" >
                    Produtos
                </span>                
            </div>
            <div className="p-2 grid grid-cols-1 gap-1 md:grid-cols-4 md:gap-2 md:mt-3 ">  
                {pedidos?.map((row, idx) => ( 
                    <div key={idx} className="h-auto rounded overflow-hidden shadow-2xl mb-5 w-full " > 
                        <div className="flex flex-row w-full h-full">
                            <div className="flex w-1/4 h-full items-center justify-center">
                                <img src={url + row.prdUrlPhoto} alt="Foto Produto" className="object-scale-down h-24 w-50" />
                            </div> 
                            <div className="flex w-full h-full">
                                <div className="flex flex-col items-center justify-start w-full h-full">   
                                    <div className="w-full ml-5 flex flex-row text-gray-700 text-xs font-bold" >
                                        {row.prdDescricao}
                                    </div>
                                    <div className="w-full ml-5 flex flex-row text-gray-700 text-xs" >
                                        {row.prdReferencia}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-start w-10 h-full">   
                                    <div className="w-full ml-5 flex flex-row text-gray-700 text-xs font-bold" >
                                        {row.itePedQtde}
                                    </div>                                                                   
                                </div>
                                <div className="flex flex-col items-center justify-start w-20 h-full">   
                                    <div className="w-full ml-5 flex flex-row text-gray-700 text-xs font-bold" >
                                        {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(row.itePedVlrTotal)}
                                    </div>                                
                                </div>
                                <div className="flex flex-col items-center w-full h-auto">
                                    <button onClick={() => handleAdiItem(row)}> 
                                        <div className="border border-green-700 rounded-md p-2 text-green-600 hover:text-white hover:bg-green-600 hover:cursor-pointer text-sm md:text-[10px] w-auto h-auto md:w-auto md:h-auto flex">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                        </div>
                                    </button>
                                    <button onClick={() => handleSubItem(row)}> 
                                        <div className="mt-1 border border-Red-700 rounded-md p-2 text-Red-600 hover:text-white hover:bg-Red-600 hover:cursor-pointer text-sm md:text-[10px] w-auto h-auto md:w-auto md:h-auto flex">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                            </svg>
                                        </div>
                                    </button> 
                                </div>
                            </div>                            
                        </div>
                    </div>                                             
                ))}
            </div>
            <button onClick={handleEndereço}> 
                <div className="flex items-center justify-center w-full h-auto">
                    <div className="w-full h-auto p-2 ml-2 mr-2 rounded-md border border-green-600">
                        <span className=" ">Finaliza Compra</span>
                    </div>
                </div>
            </button>
        </div>   
    );
}

export default CartShopping;