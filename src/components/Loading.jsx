import React from 'react'

const Loading = () => {
  return (
        <div className="absolute h-full w-full flex justify-center items-center backdrop-blur-sm z-50">
          <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />
        </div>
          
  )
}

export default Loading