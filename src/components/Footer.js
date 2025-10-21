import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-tec-blue text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Coluna 1: Sobre e Contato */}
          <div className="md:col-span-2">
            <Image 
              src="/logo-tecassistiva.svg" 
              alt="Tecassistiva Logo"
              width={180}
              height={45}
              className="mb-4"
            />
            <p className="text-gray-400 max-w-md leading-relaxed">
              Desenvolver e disseminar Tecnologia Assistiva no Brasil, por meio da oferta de produtos e serviços de excelência que contribuam para a melhoria da qualidade de vida das pessoas com deficiência e da comunidade em geral.
            </p>
            <div className="mt-6">
              <p className="text-gray-300"><strong>Telefone:</strong> +55 (11) 3266-4311</p>
              <p className="text-gray-300 mt-2"><strong>Endereço:</strong> R. das Camélias, 37 - Mirandópolis, CEP 04048-060 São Paulo - SP - Brazil</p>
            </div>
          </div>

          {/* Coluna 2: Links de Produtos */}
          <div>
            <h3 className="text-lg font-bold mb-4">Produtos</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white">Cegueira</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Baixa Visão</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Deficiência Motora e Cognitiva</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Recursos Pedagógicos</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Soluções por Ambientes</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Links de Suporte */}
          <div>
            <h3 className="text-lg font-bold mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white">Softwares</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Sintetizadores de Voz</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Manuais</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Catálogos</Link></li>
            </ul>
          </div>

        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">&copy; {currentYear} Tecassistiva. Todos os direitos reservados.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="https://www.instagram.com/tecassistiva/" className="text-gray-400 hover:opacity-75 transition-opacity" aria-label="Siga-nos no Instagram" target="_blank" rel="noopener noreferrer">
              <Image src="/logo_instagram.svg" alt="Instagram" width={24} height={24} />
            </Link>
            <Link href="https://www.youtube.com/@Tecassistiva" className="text-gray-400 hover:opacity-75 transition-opacity" aria-label="Acesse nosso canal no Youtube" target="_blank" rel="noopener noreferrer">
              <Image src="/logo_youtube.svg" alt="Youtube" width={24} height={24} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}