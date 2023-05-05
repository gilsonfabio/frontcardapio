import React from 'react'
import Image from 'next/image'
import Router, { useRouter } from "next/router";

//import logoBarra from '../assets/images/logo-barra.png'

function handleHome() {
    localStorage.clear();
    Router.push({
        pathname: '/',        
      })      
}

const Menubar = () => {   
    const router = useRouter();

    return (
        <div className="">
            <div className="bg-black flex justify-between items-center mx-auto">
                <div className="flex flex-row items-center ml-2 md:ml-28" >
                    <div className="flex items-center ">
                        <button onClick={handleHome} >
                            <Image src={'/images/logo-barra.png'} alt="Logo Prefeitura" width={120} height={80} />
                        </button>                        
                    </div>                    
                </div>                                       
            </div>                   
        </div>

    )
}

export default Menubar

