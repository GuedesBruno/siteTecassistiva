import React from 'react';
import ComparisonButton from './ComparisonButton';

const CheckIcon = () => (
    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
);

const SpecsTable = ({ specGroups, showTitle = true, showComparisonButton = false }) => {
    if (!specGroups || specGroups.length === 0) {
        return null;
    }

    return (
        <div className="w-full space-y-10">
            {specGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-4">
                    {/* Group Title */}
                    {showTitle && (
                        <div className="flex items-center space-x-4 mb-6">
                            <h3 className="text-2xl font-bold text-gray-800 relative pl-4 border-l-4 border-tec-blue">
                                {group.titulo}
                            </h3>
                            <div className="h-px bg-gray-200 flex-grow"></div>
                        </div>
                    )}

                    {(() => {
                        const items = group.itens || group.Itens || [];

                        if (showComparisonButton && items.length >= 2) {
                            const firstItems = items.slice(0, 3);
                            const restItems = items.slice(3);

                            return (
                                <>
                                    <div className="relative mb-4 max-w-3xl mx-auto">
                                        <div className="space-y-4">
                                            {firstItems.map((item, itemIndex) => {
                                                const isBooleanTrue = ['sim', 'true', 'verdadeiro'].includes(item.value?.toLowerCase());
                                                return (
                                                    <div key={itemIndex} className="flex flex-col md:flex-row md:items-stretch shadow-sm rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200">
                                                        <div className="bg-blue-50 px-6 py-3 md:w-1/2 flex items-center justify-start text-left border-b md:border-b-0 md:border-r border-blue-100">
                                                            <span className="font-bold text-black text-sm uppercase tracking-wide">
                                                                {item.label}
                                                            </span>
                                                        </div>
                                                        <div className="bg-white px-6 py-3 md:w-1/2 flex items-center justify-center text-center">
                                                            <span className="text-gray-600 font-medium text-lg w-full">
                                                                {isBooleanTrue ? <CheckIcon /> : item.value}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {/* Button Absolutely Positioned to the Right */}
                                        <div className="absolute left-full ml-4 top-0 bottom-0 w-60 hidden xl:block z-10">
                                            <ComparisonButton />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto">
                                        {restItems.map((item, index) => {
                                            const originalIndex = index + 3;
                                            const isBooleanTrue = ['sim', 'true', 'verdadeiro'].includes(item.value?.toLowerCase());
                                            return (
                                                <div key={originalIndex} className="flex flex-col md:flex-row md:items-stretch shadow-sm rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200">
                                                    <div className="bg-blue-50 px-6 py-3 md:w-1/2 flex items-center justify-start text-left border-b md:border-b-0 md:border-r border-blue-100">
                                                        <span className="font-bold text-black text-sm uppercase tracking-wide">
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                    <div className="bg-white px-6 py-3 md:w-1/2 flex items-center justify-center text-center">
                                                        <span className="text-gray-600 font-medium text-lg w-full">
                                                            {isBooleanTrue ? <CheckIcon /> : item.value}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            );
                        }

                        // Default rendering for no button or few items
                        return (
                            <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto">
                                {items.map((item, itemIndex) => {
                                    const isBooleanTrue = ['sim', 'true', 'verdadeiro'].includes(item.value?.toLowerCase());

                                    return (
                                        <div key={itemIndex} className="flex flex-col md:flex-row md:items-stretch shadow-sm rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200">
                                            {/* Label Rectangle */}
                                            <div className="bg-blue-50 px-6 py-3 md:w-1/2 flex items-center justify-start text-left border-b md:border-b-0 md:border-r border-blue-100">
                                                <span className="font-bold text-black text-sm uppercase tracking-wide">
                                                    {item.label}
                                                </span>
                                            </div>

                                            {/* Value Rectangle */}
                                            <div className="bg-white px-6 py-3 md:w-1/2 flex items-center justify-center text-center">
                                                <span className="text-gray-600 font-medium text-lg w-full">
                                                    {isBooleanTrue ? (
                                                        <div className="flex items-center justify-center">
                                                            <CheckIcon />
                                                        </div>
                                                    ) : (
                                                        item.value
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </div>
            ))}
        </div>
    );
};

export default SpecsTable;
