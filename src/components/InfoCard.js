import React from 'react';

const InfoCard = ({ title, children, actionLabel, onClick, isSticky = false, variant = 'white' }) => {
    // Base styles - Modern, Clean
    const bgClass = variant === 'blue' ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-100';

    // Simple container classes
    let containerClasses = `group relative w-full rounded-2xl overflow-hidden transition-all duration-300 ease-out ${bgClass} border cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-blue-300`;

    return (
        <div
            className={containerClasses}
            onClick={onClick}
        >
            {/* Decorative Top Accent (Cleaner) */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-tec-blue/5 to-transparent rounded-bl-full -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-110" />

            {/* Content Container */}
            <div className="relative p-6 md:p-8 flex flex-col h-full z-10">

                {/* Title */}
                {title && (
                    <h3 className="text-xl md:text-2xl font-bold mb-4 leading-tight text-[#002554]">
                        {title}
                    </h3>
                )}

                {/* Content Body */}
                <div className="text-black flex-grow prose max-w-none mb-6">
                    {children}
                </div>

                {/* Action Label (Optional) */}
                {actionLabel && (
                    <div className="mt-auto flex items-center text-tec-blue font-semibold text-sm uppercase tracking-wide opacity-90 group-hover:opacity-100 transition-opacity">
                        {actionLabel}
                        <svg
                            className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InfoCard;
