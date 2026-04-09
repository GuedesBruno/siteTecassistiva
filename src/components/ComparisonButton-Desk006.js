'use client';
import React from 'react';

const ComparisonButton = () => {
    // Simple client-side A/B test
    const [variant, setVariant] = React.useState(0);

    React.useEffect(() => {
        // Randomly assign variant 0 or 1 on mount
        setVariant(Math.random() < 0.5 ? 0 : 1);
    }, []);

    const handleClick = () => {
        console.log(`[A/B Test] Button clicked. Variant: ${variant === 0 ? 'A (Diferenças)' : 'B (Avaliar)'}`);
    };

    const text = variant === 0
        ? "Clique para entender as diferenças entre impressoras Braille"
        : "Clique para saber avaliar uma impressora Braille";

    return (
        <>
            <style jsx global>{`
                .btn-snake {
                    position: relative;
                    overflow: hidden;
                    background: #004b8d; /* tec-blue fallback */
                }
                .btn-snake span {
                    position: absolute;
                    display: block;
                }
                /* Top */
                .btn-snake span:nth-child(1) {
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #60a5fa);
                    animation: btn-anim1 2s linear infinite;
                }
                @keyframes btn-anim1 {
                    0% { left: -100%; }
                    50%, 100% { left: 100%; }
                }

                /* Right */
                .btn-snake span:nth-child(2) {
                    top: -100%;
                    right: 0;
                    width: 2px;
                    height: 100%;
                    background: linear-gradient(180deg, transparent, #60a5fa);
                    animation: btn-anim2 2s linear infinite;
                    animation-delay: 0.5s;
                }
                @keyframes btn-anim2 {
                    0% { top: -100%; }
                    50%, 100% { top: 100%; }
                }

                /* Bottom */
                .btn-snake span:nth-child(3) {
                    bottom: 0;
                    right: 0;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(270deg, transparent, #60a5fa);
                    animation: btn-anim3 2s linear infinite;
                    animation-delay: 1s;
                }
                @keyframes btn-anim3 {
                    0% { right: -100%; }
                    50%, 100% { right: 100%; }
                }

                /* Left */
                .btn-snake span:nth-child(4) {
                    bottom: -100%;
                    left: 0;
                    width: 2px;
                    height: 100%;
                    background: linear-gradient(360deg, transparent, #60a5fa);
                    animation: btn-anim4 2s linear infinite;
                    animation-delay: 1.5s;
                }
                @keyframes btn-anim4 {
                    0% { bottom: -100%; }
                    50%, 100% { bottom: 100%; }
                }
            `}</style>
            <a
                href="/comparativo-impressao"
                onClick={handleClick}
                className="block w-full h-full"
            >
                <div className="btn-snake bg-tec-blue hover:bg-blue-900 text-white p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 text-center group cursor-pointer h-full flex flex-col items-center justify-center border border-transparent">
                    {/* The 4 border spans */}
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>

                    <div className="font-bold text-xs md:text-sm leading-tight flex flex-col items-center justify-center gap-1 relative z-10 px-2">
                        <svg className="w-5 h-5 animate-pulse mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {text}
                    </div>
                    <div className="text-blue-100 text-[10px] mt-2 block group-hover:text-white transition-colors leading-tight font-medium relative z-10 px-2">
                        Descubra como a velocidade impacta sua produção
                    </div>
                </div>
            </a>
        </>
    );
};

export default ComparisonButton;
