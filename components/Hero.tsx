export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/50 via-slate-950 to-slate-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <div className="animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-full">
            Tecnologia 3D para o mercado imobiliário
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6">
            Venda imóveis{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              antes de construir
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Tours virtuais 3D interativos que rodam no navegador do seu cliente.
            Sem app, sem download. Compartilhe via WhatsApp e venda mais rápido.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/scan"
              className="w-full sm:w-auto px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-xl text-lg font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25"
            >
              Escanear Imóvel
            </a>
            <a
              href="https://wa.me/5500000000000?text=Quero%20saber%20mais%20sobre%20o%20Im%C3%B3vel%203D"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 border border-white/20 hover:border-white/40 rounded-xl text-lg font-semibold transition-all hover:bg-white/5"
            >
              Falar com Consultor
            </a>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in-up-delay">
          {[
            { value: "3x", label: "mais visitas" },
            { value: "48h", label: "para criar" },
            { value: "0", label: "apps para baixar" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
