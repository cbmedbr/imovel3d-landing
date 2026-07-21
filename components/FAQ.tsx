"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Precisa instalar algum aplicativo?",
    answer:
      "Não! Tudo roda direto no navegador do celular ou computador. Basta abrir o link.",
  },
  {
    question: "Funciona no celular?",
    answer:
      "Sim, 100%. Usamos WebGL que é compatível com todos os smartphones modernos. Seu cliente abre pelo WhatsApp e já navega pelo imóvel.",
  },
  {
    question: "Como é feito o modelo 3D?",
    answer:
      "Você nos envia a planta do imóvel e referências de acabamento. Nossa equipe cria o modelo 3D em até 48 horas. Para imóveis existentes, podemos usar escaneamento com Gaussian Splatting.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer:
      "Sim, sem fidelidade. Cancele quando quiser, sem multas ou burocracia.",
  },
  {
    question: "Integra com meu site atual?",
    answer:
      "Sim! Você pode incorporar via iframe no seu site ou simplesmente compartilhar o link direto com seus clientes.",
  },
  {
    question: "Qual a diferença para um tour 360° com fotos?",
    answer:
      "Tour 360° usa fotos estáticas — você não pode mudar acabamentos, ver o imóvel de ângulos diferentes ou interagir. Nosso tour é 3D real: o cliente navega livremente, troca materiais e vê cada detalhe.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-slate-400">
            Tire suas dúvidas sobre a plataforma.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-medium pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openIndex === i && (
                <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
