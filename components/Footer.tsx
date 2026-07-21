export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Imóvel 3D
          </span>
          <p className="text-sm text-slate-500 mt-1">
            Tours virtuais 3D para o mercado imobiliário
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-500">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#planos" className="hover:text-white transition-colors">
            Planos
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
          <a href="#contato" className="hover:text-white transition-colors">
            Contato
          </a>
        </div>

        <p className="text-sm text-slate-600">
          © 2026 Imóvel 3D. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
