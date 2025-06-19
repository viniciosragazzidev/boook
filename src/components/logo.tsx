import Image from 'next/image'
import React from 'react'
import LogoBook from '../../public/logo.png'

const Logo = () => {
  return (
    <div className="flex w-full items-center justify-center">
    <Image className='mx-auto' src={LogoBook} alt="Logo" width={100} height={100} />

    </div>
  )
}

export default Logo