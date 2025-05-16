import React from 'react'

const GenreButton = ({name}) => {
  return (
    <button className='text-white font-semibold leading-[28px] px-[18px] py-[8px] bg-[#221F3D] rounded-[6px]'>
        {name}
    </button>
  )
}

export default GenreButton