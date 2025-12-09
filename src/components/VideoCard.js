'use client';
import { useState, useEffect } from 'react';
import { getStrapiMediaUrl } from '@/lib/media';

// Função auxiliar para extrair ID do vídeo
const getVideoId = (url) => {
    if (!url) return null;
    let match = /vimeo\.com\/([\d\/a-zA-Z]+)/i.exec(url);
    if (match && match[1]) return { type: 'vimeo', id: match[1] };
    match = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i.exec(url);
    if (match && match[1]) return { type: 'youtube', id: match[1] };
    return null;
};

export default function VideoCard({ video, onVideoClick }) {
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const attrs = video.attributes || video;
    const videoInfo = getVideoId(attrs.link);

    useEffect(() => {
        if (!videoInfo) return;
        let isMounted = true;
        const determineThumbnailUrl = async () => {
            const strapiThumbnail = attrs.thumbnail;
            const thumbnailUrlPath = strapiThumbnail?.data?.attributes?.url || strapiThumbnail?.url;
            const strapiUrl = getStrapiMediaUrl(thumbnailUrlPath);
            if (strapiUrl) {
                if (isMounted) setThumbnailUrl(strapiUrl);
                return;
            }
            if (videoInfo.type === 'youtube') {
                if (isMounted) setThumbnailUrl(`https://i.ytimg.com/vi/${videoInfo.id}/hqdefault.jpg`);
            } else if (videoInfo.type === 'vimeo') {
                try {
                    const response = await fetch(`https://vimeo.com/api/oembed.json?url=${attrs.link}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (isMounted) setThumbnailUrl(data.thumbnail_url);
                    }
                } catch (error) {
                    console.error("Erro ao buscar thumbnail do Vimeo:", error);
                }
            }
        };
        determineThumbnailUrl();
        return () => { isMounted = false; };
    }, [attrs.link, attrs.thumbnail, videoInfo]);

    if (!videoInfo) return null;

    return (
        <div className="group block rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 text-left w-full bg-white border border-gray-100">
            <button onClick={() => onVideoClick(videoInfo)} className="relative block w-full">
                <div className="aspect-square">
                    {thumbnailUrl ? (
                        <img src={thumbnailUrl} alt={attrs.titulo} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-200 animate-pulse" />
                    )}
                </div>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                </div>
            </button>
        </div>
    );
}
