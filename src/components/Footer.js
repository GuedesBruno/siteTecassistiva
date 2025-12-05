import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-tec-blue text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">

          {/* Coluna 1: Sobre e Contato */}
          <div className="md:col-span-3">
            <Image
              src="/logo-tecassistiva.svg"
              alt="Tecassistiva Logo"
              width={180}
              height={45}
              className="mb-4"
            />
            <div className="mt-6">
              <p className="text-gray-300"><strong>Telefone:</strong> +55 (11) 3266-4311</p>
              <p className="text-gray-300 mt-2"><strong>Endereço:</strong> R. das Camélias, 37</p>
              <p>Mirandópolis, CEP 04048-060</p>
              <p>São Paulo - SP - Brasil</p>
            </div>
          </div>

          {/* Container Flex para Menus na Direita */}
          <div className="md:col-span-9 flex flex-col md:flex-row md:justify-end gap-8 md:gap-16">

            {/* Coluna 2: Links Institucionais */}
            <div className="md:text-right">
              <h3 className="text-lg font-bold mb-4">Institucional</h3>
              <ul className="space-y-2">
                <li><Link href="/tecassistiva" className="text-gray-400 hover:text-white">Quem Somos</Link></li>
                <li><Link href="/atas-abertas" className="text-gray-400 hover:text-white">Atas Abertas</Link></li>
                <li><Link href="/contato" className="text-gray-400 hover:text-white">Contato</Link></li>
              </ul>
            </div>

            {/* Coluna 3: Links de Produtos */}
            <div className="md:text-right">
              <h3 className="text-lg font-bold mb-4">Produtos</h3>
              <ul className="space-y-2">
                <li><Link href="/ambientes" className="text-gray-400 hover:text-white">Soluções por Ambientes</Link></li>
                <li><Link href="/produtos/categorias/cegueira" className="text-gray-400 hover:text-white">Cegueira</Link></li>
                <li><Link href="/produtos/categorias/baixa-visao" className="text-gray-400 hover:text-white">Baixa Visão</Link></li>
                <li><Link href="/produtos/categorias/recursos-pedagogicos" className="text-gray-400 hover:text-white">Recurso Pedagógico</Link></li>
                <li><Link href="/produtos/categorias/deficiencia-motora-e-cognitiva" className="text-gray-400 hover:text-white">Deficiência Motora e Cognitiva</Link></li>
              </ul>
            </div>

            {/* Coluna 4: Links de Suporte */}
            <div className="md:text-right">
              <h3 className="text-lg font-bold mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li><Link href="/suporte?tab=softwares" className="text-gray-400 hover:text-white">Softwares</Link></li>
                <li><Link href="/suporte?tab=documentos" className="text-gray-400 hover:text-white">Manuais e Documentos</Link></li>
                <li><Link href="/suporte?tab=drivers" className="text-gray-400 hover:text-white">Drivers e Utilitários</Link></li>
                <li><Link href="/suporte?tab=contato" className="text-gray-400 hover:text-white">Contato do Suporte</Link></li>
              </ul>
            </div>
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
