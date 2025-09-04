// ModuleCard.jsx
import React from 'react';

const ModuleCard = ({ module, index, renderIcon }) => {
    return (
        <div className="group relative overflow-hidden bg-gradient-to-br from-gray-800/90 via-gray-700/80 to-gray-800/90 rounded-3xl p-6 border border-gray-600/50 shadow-2xl hover:shadow-blue-500/20 hover:shadow-2xl transition-all duration-500 backdrop-blur-sm">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${
                index % 4 === 0 ? 'from-blue-500/30 to-cyan-500/30' :
                index % 4 === 1 ? 'from-blue-400/30 to-purple-500/30' :
                index % 4 === 2 ? 'from-blue-600/30 to-cyan-400/30' :
                'from-blue-700/30 to-purple-600/30'
            } rounded-full opacity-20 transform translate-x-12 -translate-y-12 group-hover:opacity-40 transition-opacity duration-500`}></div>
            <div className="relative z-10">
                <div className={`w-12 h-12 bg-gradient-to-br ${
                    index % 4 === 0 ? 'from-blue-500 to-blue-600' :
                    index % 4 === 1 ? 'from-blue-400 to-blue-500' :
                    index % 4 === 2 ? 'from-blue-600 to-blue-700' :
                    'from-blue-700 to-blue-800'
                } rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    {renderIcon(module.icon, "w-6 h-6 text-white")}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {module.title}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                    {module.description}
                </p>
                <div className="text-xs text-blue-400 font-medium">
                    Duration: {module.duration}
                </div>
            </div>
        </div>
    );
};

export default ModuleCard;