import React from 'react'

const Footer = () => {   
    return (
        <nav className="bg-black p-2 h-32">
            <div className="flex justify-between items-center mx-auto">
                <div className="w-full flex flex-col items-center" >
                    <div className="w-full flex items-center justify-center ">
                        <span className='text-green-400 text-sm font-bold mt-10'>Prefeitura de Aparecida de Goiânia</span>
                    </div>
                    <div className="w-full flex items-center justify-center ">
                        <span className='text-green-400 text-[8px] font-bold mt-10'>Versão:1.06 - 01/03/2023</span>
                    </div>                     
                </div>                               
            </div>
        </nav> 
    )
}

export default Footer

