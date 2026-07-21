const features = [
  {
    icon: "🏠",
    title: "Tour Virtual 360°",
    description:
      "Seu cliente navega pelo imóvel como se estivesse lá. Cada cômodo, cada detalhe.",
  },
  {
    icon: "🎨",
    title: "Configurador de Acabamentos",
    description:
      "Troque pisos, paredes e móveis em tempo real. O cliente monta o apartamento ideal.",
  },
  {
    icon: "🏗️",
    title: "Maquete Digital Interativa",
    description:
      "Substitua maquetes físicas de R$50k por uma versão digital clicável e compartilhável.",
  },
  {
    icon: "🥽",
    title: "Compatível com VR/AR",
    description:
      "WebXR nativo. Funciona com óculos VR ou realidade aumentada direto no celular.",
  },
  {
    icon: "📱",
    title: "Roda no Celular",
    description:
      "Sem app para baixar. Mande o link no WhatsApp e o cliente abre na hora.",
  },
  {
    icon: "🔗",
    title: "Integração com CRM",
    description:
      "Conecte com seu sistema. Saiba quem visitou, quanto tempo ficou, o que clicou.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Tudo que você precisa para{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              vender mais
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Ferramentas profissionais de visualização 3D, acessíveis para qualquer corretora.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
