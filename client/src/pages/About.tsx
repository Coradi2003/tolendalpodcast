import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Menu, X, Plus, Target, Mic, Globe } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import UploadEpisodeModal from "@/components/UploadEpisodeModal";

export default function About() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { isAdmin } = useAdminAuth();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{ backgroundColor: "rgba(15, 20, 25, 0.8)", borderColor: "var(--border)" }}
      >
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #00d9ff 0%, #ff6b35 100%)",
                }}
              >
                <Play className="w-4 h-4 fill-white text-white" />
              </div>
              <span
                className="font-bold text-base md:text-lg"
                style={{ color: "var(--foreground)", fontFamily: "'Sora', sans-serif" }}
              >
                Política & Negócios
              </span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/">
              <span
                className="text-sm font-medium hover:opacity-70 transition"
                style={{ color: "var(--foreground)" }}
              >
                Início
              </span>
            </Link>
            <Link href="/episodes">
              <span
                className="text-sm font-medium hover:opacity-70 transition"
                style={{ color: "var(--foreground)" }}
              >
                Episódios
              </span>
            </Link>
            <Link href="/about">
              <span
                className="text-sm font-medium border-b-2 pb-0.5"
                style={{ color: "var(--primary)", borderColor: "var(--primary)" }}
              >
                Sobre
              </span>
            </Link>
            {isAdmin ? (
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                size="sm"
                className="gap-1"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            ) : (
              <Link href="/admin">
                <Button
                  variant="outline"
                  size="sm"
                  style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
                >
                  Admin
                </Button>
              </Link>
            )}
          </div>
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ color: "var(--foreground)" }}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div
            className="md:hidden border-t px-4 py-4 space-y-3"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <Link href="/">
              <span
                className="block text-sm font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ color: "var(--foreground)" }}
              >
                Início
              </span>
            </Link>
            <Link href="/episodes">
              <span
                className="block text-sm font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ color: "var(--foreground)" }}
              >
                Episódios
              </span>
            </Link>
            <Link href="/about">
              <span
                className="block text-sm font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ color: "var(--primary)" }}
              >
                Sobre
              </span>
            </Link>
            {isAdmin ? (
              <Button
                onClick={() => {
                  setIsUploadModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                size="sm"
                className="w-full gap-1"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            ) : (
              <Link href="/admin">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
                >
                  Admin
                </Button>
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        className="py-12 md:py-20 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%)",
        }}
      >
        <div className="container">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--foreground)", fontFamily: "'Sora', sans-serif" }}
          >
            Sobre o Podcast
          </h1>
          <p className="text-base md:text-lg max-w-2xl" style={{ color: "var(--muted-foreground)" }}>
            Conheça a história, missão e os valores que guiam o Política & Negócios em Profundidade
          </p>
        </div>
      </section>

      {/* Content Section */}
      <div className="container py-16 md:py-24">
        {/* Mission */}
        <div className="max-w-3xl mx-auto mb-16 md:mb-24 pb-16 md:pb-24 border-b" style={{ borderColor: "var(--border)" }}>
          <h2
            className="text-2xl md:text-4xl font-bold mb-6"
            style={{ color: "var(--foreground)", fontFamily: "'Sora', sans-serif" }}
          >
            Nossa Missão
          </h2>
          <p
            className="text-base md:text-lg mb-6 leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            O podcast <strong style={{ color: "var(--primary)" }}>Política & Negócios em Profundidade</strong> nasceu
            da necessidade de criar um espaço de análise séria e aprofundada sobre os temas que moldam
            o Brasil contemporâneo. Em um cenário de informações superficiais e polarização crescente,
            buscamos oferecer perspectivas equilibradas e fundamentadas.
          </p>
          <p
            className="text-base md:text-lg leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            Através de entrevistas exclusivas com especialistas, economistas, políticos e líderes
            empresariais, exploramos as interseções entre política e economia que definem o futuro
            do país.
          </p>
        </div>

        {/* Values */}
        <div className="max-w-4xl mx-auto mb-16 md:mb-24 pb-16 md:pb-24 border-b" style={{ borderColor: "var(--border)" }}>
          <h2
            className="text-2xl md:text-4xl font-bold mb-8"
            style={{ color: "var(--foreground)", fontFamily: "'Sora', sans-serif" }}
          >
            Nossos Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Target className="w-6 h-6" style={{ color: "var(--primary)" }} />,
                title: "Rigor Analítico",
                desc: "Análises baseadas em dados, fatos e perspectivas de especialistas reconhecidos",
              },
              {
                icon: <Mic className="w-6 h-6" style={{ color: "var(--accent)" }} />,
                title: "Pluralidade de Vozes",
                desc: "Diferentes perspectivas e visões para uma compreensão mais completa da realidade",
              },
              {
                icon: <Globe className="w-6 h-6" style={{ color: "var(--primary)" }} />,
                title: "Contexto Global",
                desc: "Conexões entre o cenário brasileiro e as tendências internacionais",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="p-6 md:p-7"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: i === 1 ? "rgba(255, 107, 53, 0.1)" : "rgba(0, 217, 255, 0.1)",
                  }}
                >
                  {item.icon}
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: "var(--foreground)", fontFamily: "'Sora', sans-serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                  {item.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Host */}
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl md:text-4xl font-bold mb-8"
            style={{ color: "var(--foreground)", fontFamily: "'Sora', sans-serif" }}
          >
            Sobre o Apresentador
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
            {/* Avatar */}
            <div className="flex justify-center">
              <div
                className="w-40 h-40 md:w-48 md:h-48 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(0, 217, 255, 0.2) 0%, rgba(255, 107, 53, 0.2) 100%)",
                }}
              >
                <span className="text-6xl md:text-7xl font-bold opacity-30" style={{ color: "var(--primary)" }}>
                  👤
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="md:col-span-2">
              <h3
                className="text-2xl md:text-3xl font-bold mb-3"
                style={{ color: "var(--foreground)", fontFamily: "'Sora', sans-serif" }}
              >
                [Nome do Apresentador]
              </h3>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "var(--muted-foreground)" }}
              >
                Especialista em economia e política com mais de 15 anos de experiência no mercado
                financeiro e análise estratégica. Formado em Administração de Empresas e Economia.
              </p>
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: "var(--muted-foreground)" }}
              >
                Apaixonado por transformar dados complexos em insights acessíveis, dedica-se a
                criar conteúdo que eduque e inspire profissionais, empreendedores e cidadãos
                interessados em entender os mecanismos da economia e política brasileira.
              </p>
              <div className="flex flex-wrap gap-3">
                {["LinkedIn", "Twitter", "Email"].map((social) => (
                  <Button
                    key={social}
                    variant="outline"
                    size="sm"
                    style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    {social}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section
        className="py-16 md:py-24"
        style={{
          background: "linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%)",
        }}
      >
        <div className="container text-center">
          <h2
            className="text-2xl md:text-4xl font-bold mb-4 md:mb-6"
            style={{ color: "var(--foreground)", fontFamily: "'Sora', sans-serif" }}
          >
            Acompanhe Nossos Episódios
          </h2>
          <p
            className="text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto opacity-80"
            style={{ color: "var(--foreground)" }}
          >
            Inscreva-se no nosso grupo de WhatsApp para receber notificações sobre novos episódios
          </p>
          <Button
            size="lg"
            className="gap-2 w-full sm:w-auto font-semibold"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}
          >
            Entrar no WhatsApp
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-10 md:py-14 border-t"
        style={{
          backgroundColor: "var(--card)",
          color: "var(--foreground)",
          borderColor: "var(--border)",
        }}
      >
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #00d9ff 0%, #ff6b35 100%)",
                  }}
                >
                  <Play className="w-4 h-4 fill-current" style={{ color: "white" }} />
                </div>
                <span className="font-bold text-base" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Política & Negócios
                </span>
              </div>
              <p className="text-xs md:text-sm opacity-80">Análises profundas sobre os temas que movem o Brasil</p>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-sm">Navegação</h4>
              <ul className="space-y-2 opacity-80 text-xs md:text-sm">
                <li>
                  <Link href="/">
                    <span className="hover:opacity-100 transition cursor-pointer">Início</span>
                  </Link>
                </li>
                <li>
                  <Link href="/episodes">
                    <span className="hover:opacity-100 transition cursor-pointer">Episódios</span>
                  </Link>
                </li>
                <li>
                  <Link href="/about">
                    <span className="hover:opacity-100 transition cursor-pointer">Sobre</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-sm">Comunidade</h4>
              <ul className="space-y-2 opacity-80 text-xs md:text-sm">
                <li>
                  <a href="#" className="hover:opacity-100 transition">
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-100 transition">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-100 transition">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-sm">Contato</h4>
              <p className="opacity-80 text-xs md:text-sm">contato@politicaenegocio.com</p>
            </div>
          </div>
          <div
            className="border-t pt-6 text-center opacity-70 text-xs md:text-sm"
            style={{ borderColor: "var(--border)" }}
          >
            <p>&copy; 2024 Política & Negócios em Profundidade. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <UploadEpisodeModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => {
          setIsUploadModalOpen(false);
        }}
        adminToken=""
      />
    </div>
  );
}
