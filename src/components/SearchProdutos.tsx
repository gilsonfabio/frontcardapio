import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import Link from "next/link";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { setCookie, parseCookies, destroyCookie } from 'nookies'


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

const SearchProdutos = ({usrId, nivel}: any) => {
    const [products, setProducts] = useState<Array<productsProps>>([]);
    const [grupos, setGrupos] = useState([]);
    const [linhas, setLinhas] = useState([]);
    const [url, setUrl] = useState('http://localhost:3333/files/upload/products/');
     
    const [pedData, setPedData] = useState('');
    const [pedId, setPedId] = useState('');
    const [pedCliId, setPedCliId] = useState('');
    const [pedQtdTotal, setPedQtdTotal] = useState(0);
    const [pedVlrTotal, setPedVlrTotal] = useState(0);
    const [pedCupom, setPedCupom] = useState('');
    const [pedVlrPagar, setPedVlrPagar] = useState(0);
    const [pedEndEntrega, setPedEndEntrega] = useState(0);
    const [pedVlrTaxEntrega, setPedVlrTaxEntrega] = useState(0);
    const [pedFrmPagto, setPedFrmPagto] = useState(0);
    const [pedUltItem, setPedUltItem] = useState(0);
    const [itePedProId, setItePedProId] = useState('');
    const [itePedQtde, setItePedQtde] = useState(0);
    const [itePedVlrUnit, setItePedVlrUnit] = useState('');
     
    const [idPro, setIdPro] = useState(0);
    const [ids, setIds] = useState<Array<number>>([]);
    const [idsPro, setIdsPro] = useState<Array<number>>([]);
    const [countItens, setCountItens] = useState(0);
    const [idUsrCar, setIdUsrCar] = useState();
     
    const [nivLiberado, setNivLiberado] = useState('9');
    const [atualiza, setAtualiza] = useState(0);
    const router = useRouter();
      
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
            url: `/searchCar/${idUsr}`,
            headers: {
                "x-access-token" : token    
            },      
        }).then(function(resp) {
            console.log(resp.data)
            setCountItens(resp.data.pedQtdTotal);
            setPedId(resp.data.pedId);
            setPedData(resp.data.pedData);
            setPedCliId(resp.data.pedCliId);
            setPedQtdTotal(resp.data.pedQtdTotal);
            setPedVlrTotal(resp.data.pedVlrTotal);
            setPedCupom(resp.data.pedCupom);
            setPedVlrPagar(resp.data.pedVlrPagar);
            setPedEndEntrega(resp.data.pedEndEntrega);
            setPedVlrTaxEntrega(resp.data.pedVlrTaxEntrega);
            setPedFrmPagto(resp.data.pedFrmPagto);
            setPedUltItem(resp.data.pedUltItem);
        }).catch(function(error) {  
                          
        })         

        api({
            method: 'get',    
            url: `products`,
            headers: {
                "x-access-token" : token    
            },      
        }).then(function(response) {
            setProducts(response.data);
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
        if (atualiza > 0) {
            const { 'nextauth.token': token } = parseCookies();
            const { 'nextauth.refreshToken': refreshToken } = parseCookies();
            const { 'nextauth.usrId': idUsr } = parseCookies();
            const { 'nextauth.usrNivAcesso': nivAcesso } = parseCookies();
              
            api({
                method: 'get',    
                url: `products`,
                headers: {
                    "x-access-token" : token    
                },      
            }).then(function(response) {
                setProducts(response.data);
            }).catch(function(error) {                
                alert(`Falha no token de acesso dos produtos`);
            })
        }
    }, [atualiza])

    async function handleAdicione(row) {
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

        api({
            method: 'post',    
            url: `newprocar`,
            data: {
                pedId,
                pedData: dataAtual, 
                pedCliId: idUsr, 
                pedQtdTotal: qtdProd, 
                pedVlrTotal: row.prdVdaUnitario, 
                pedCupom, 
                pedVlrPagar: row.prdVdaUnitario, 
                pedEndEntrega,
                pedVlrTaxEntrega, 
                pedFrmPagto, 
                pedUltItem,
                itePedProId: row.prdId, 
                itePedQtde: qtdProd, 
                itePedVlrUnit: row.prdVdaUnitario
            },
            headers: {
                "x-access-token" : token    
            },      
        }).then(function(response) {
            alert(`Produto incluido com sucesso!,${response.data}`)
            setPedId(response.data);
        }).catch(function(error) {                
            alert('Erro na inclusão!');
        })        
    }

    function handleCartShop(){
        Router.push({
          pathname: '/CartShopping',
          query: { id: `${pedId}`}        
        })        
    }
     
    return (
        <div className="mb-32 h-auto">
            <div className='flex items-center justify-between w-full h-12 bg-gray-300 '>
                <span className='text-[12px] font-bold text-black ml-2 md:ml-28 '>Olá, {nomUsr}</span>
                <div className='mr-5'>
                    <span className='absolute text-[8px] font-bold text-Red-600 ml-9'>{countItens}</span>
                    <button onClick={handleCartShop} className="md:mr-28 flex items-center justify-center hover:cursor-pointer w-10 h-10 rounded-full bg-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-white ">
                            <path stroke="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>            
                    </button>          
                </div>  
            </div>
            <div className="flex flex-row justify-between items-center ">
                <span className="flex flex-row justify-center items-center text-3xl font-bold text-green-600 mt-6 mb-6" >
                    Produtos
                </span>                
            </div>
            <div className="p-2 grid grid-cols-1 gap-1 md:grid-cols-4 md:gap-2 md:mt-3 ">  
                {products?.map((row) => ( 
                    <div key={row.prdId} className="h-auto rounded overflow-hidden shadow-2xl mb-5 w-full " > 
                        <div className="flex flex-row w-full h-full">
                            <div className="flex w-1/4 h-full items-center justify-center">
                                <img src={url + row.prdUrlPhoto} alt="Logo Pé de Cana" className="object-scale-down h-48 w-96" />
                            </div> 
                            <div className="w-full h-full">   
                                <div className="w-full ml-5 flex flex-row text-gray-700 text-[14px] font-bold" >
                                    {row.prdDescricao}
                                </div>
                                <div className="w-full ml-5 flex flex-row text-gray-700 text-[12px]" >
                                    {row.prdReferencia}
                                </div>
                                <div className="w-full flex flex-row items-center justify-between text-gray-700 ml-5" >
                                    <div className="w-full">    
                                        {row.grpDescricao}
                                    </div>
                                    <div className="w-full" >
                                        {row.lnhDescricao}
                                    </div>
                                </div> 
                                <div className="flex items-center justify-between w-full h-auto mr-5 mt-8" >
                                    <div className="flex items-center w-full h-auto">
                                        <span className="text-Red-600 text-[16px] font-bold ml-5" >
                                            {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.prdVdaUnitario)}
                                        </span>
                                    </div>                                        
                                    <div className="flex flex-col items-center w-full h-auto">
                                        <button onClick={() => handleAdicione(row)}> 
                                            <div className="border border-green-700 rounded-md p-2 text-green-600 hover:text-white hover:bg-green-600 hover:cursor-pointer text-sm md:text-[10px] w-auto h-auto md:w-auto md:h-auto flex">
                                                Comprar
                                            </div>
                                        </button> 
                                    </div>
                                </div>                                
                            </div>
                        </div>
                    </div>                                             
                ))}
            </div>
        </div>   
    );
}

export default SearchProdutos;