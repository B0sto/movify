import React from 'react'
import SearchIcon from '../../../../public/SearchIcon'


const Search = ({ searchTerm, setSearchTerm }) => {

  return (
    <div className='search'>
      <div className='search-wrapper'>
        <SearchIcon />

        <input type="text"
          placeholder='Search through thousands of movies'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} />

      </div>
    </div>
  )
}

export default Search