export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>&copy; {currentYear} Tecassistiva. Todos os direitos reservados.</p>
        <p className="text-sm text-gray-400 mt-2">
          Tecnologia & Acessibilidade
        </p>
      </div>
    </footer>
  );
}