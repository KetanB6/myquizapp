"use client"
import React from 'react'
import Card from './component/card'
import Card1 from './component/card1'
const page = () => {
  return (
    <div>



      <div className='ml-5 gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        <Card />
        <Card1 />
        <Card />
        <Card1 />
      </div>
      
    </div>
  )
}

export default page
