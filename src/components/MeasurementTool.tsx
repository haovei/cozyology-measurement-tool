import React from 'react'

interface MeasurementToolProps {
  title?: string
  theme?: 'light' | 'dark'
}

export const MeasurementTool: React.FC<MeasurementToolProps> = ({ 
  title = 'Cozyology Measurement Tool',
  theme = 'light' 
}) => {
  const themeClasses = theme === 'dark' 
    ? 'bg-gray-900 text-white' 
    : 'bg-white text-gray-900'

  return (
    <div className={`p-8 rounded-lg shadow-lg ${themeClasses} max-w-2xl mx-auto`}>
      <h1 className="text-3xl font-bold mb-6 text-center">{title}</h1>
      
      <div className="text-center space-y-4">
        <p className="text-lg text-gray-600">
          欢迎使用 Cozyology 测量工具
        </p>
        
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-blue-800">功能特点</h2>
          <ul className="list-disc list-inside space-y-2 text-blue-700">
            <li>简洁易用的界面</li>
            <li>支持多种测量单位</li>
            <li>精确的测量计算</li>
            <li>响应式设计</li>
          </ul>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            开始使用
          </button>
        </div>
      </div>
    </div>
  )
}
