const plans = [
  {
    name: "Básico",
    price: "R$297",
    period: "/mês",
    description: "Para corretores autônomos",
    features: [
      "1 imóvel ativo",
      "Tour virtual simples",
      "Link compartilhável",
      "Suporte por email",
    ],
    cta: "Começar Agora",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "R$997",
    period: "/mês",
    description: "Para imobiliárias",
    features: [
      "Até 10 imóveis ativos",
      "Tour + configurador de acabamentos",
      "Analytics de visitantes",
      "Integração WhatsApp",
      "Suporte prioritário",
    ],
    cta: "Escolher Pro",
    highlighted: true,
  },
  {
    name: "Premium",
    price: "R$2.497",
    period: "/mês",
    description: "Para construtoras",
    features: [
      "Imóveis ilimitados",
      "Tudo do Pro",
      "Maquete digital do empreendimento",
      "VR/AR (WebXR)",
      "Integração com CRM",
      "Gerente de conta dedicado",
    ],
    cta: "Escolher Premium",
    highlighted: false,
  },
  {
    name: "Personalizado",
    price: "Sob consulta",
    period: "",
    description: "Para grandes operações",
    features: [
      "Tudo do Premium",
      "API de integração",
      "White-label (sua marca)",
      "SLA garantido",
      "Desenvolvimento sob demanda",
      "Onboarding personalizado",
    ],
    cta: "Falar com Vendas",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="planos" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Planos que cabem no seu{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              orçamento
            </span>
          </h2>
          <p className="text-slate-400">
            Comece pequeno e escale conforme cresce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-6 rounded-2xl border ${
                plan.highlighted
                  ? "bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/10"
                  : "bg-white/5 border-white/10"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 rounded-full text-xs font-medium">
                  Mais Popular
                </div>
              )}

              <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
              <p className="text-sm text-slate-400 mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-slate-400 text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                    <svg className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#contato"
                className={`block w-full py-3 rounded-xl text-center font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-white/10 hover:bg-white/15 text-white"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
