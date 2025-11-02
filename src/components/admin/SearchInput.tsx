import React from 'react'
import { FiSearch } from 'react-icons/fi'

interface Props {
  value: string
  placeholder?: string
  onChange: (v: string) => void
}

const SearchInput: React.FC<Props> = ({ value, placeholder = 'Search…', onChange }) => {
  return (
    <div className="relative w-full">
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full 
          pl-10 pr-4 py-2.5 
          bg-gray-50 dark:bg-gray-800/60 
          border border-gray-200 dark:border-gray-700 
          rounded-lg 
          text-gray-900 dark:text-gray-100 
          placeholder-gray-400 dark:placeholder-gray-500 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          transition-all duration-200
          shadow-sm hover:shadow-md
        "
      />
    </div>
  )
}

export default SearchInput
