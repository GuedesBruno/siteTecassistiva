import Link from 'next/link';
import Image from 'next/image';

export default function SocialMediaSection() {
  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/tecassistiva/',
      icon: '/logo_instagram.svg',
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@Tecassistiva',
      icon: '/logo_youtube.svg',
    },
  ];

  return (
    <section className="py-12 bg-gray-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Conecte-se Conosco!
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Siga-nos nas redes sociais e fique por dentro de todas as novidades, eventos e lançamentos da Tecassistiva.
        </p>
        <div className="flex justify-center space-x-6">
          {socialLinks.map((social) => (
            <Link key={social.name} href={social.url} target="_blank" rel="noopener noreferrer"
               className="text-gray-400 hover:text-white transition-transform transform hover:scale-110">
                <Image 
                    src={social.icon} 
                    alt={`${social.name} logo`}
                    width={40} 
                    height={40}
                />
              <span className="sr-only">{social.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
