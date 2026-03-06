import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Play,
  ArrowRight,
  MessageCircle,
  TrendingUp,
  Users,
  Zap,
  Menu,
  X,
  Plus,
} from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import UploadEpisodeModal from "@/components/UploadEpisodeModal";

function getEmbedUrl(url: string): string {
  if (!url) return "";
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  if (url.includes("spotify.com")) {
    return url.replace("open.spotify.com", "open.spotify.com/embed").replace("/episode/", "/embed/episode/");
  }
  return url;
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function SponsorsSection() {
  const { data: sponsors = [] } = trpc.sponsors.list.useQuery();

  if (sponsors.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: "var(--muted-foreground)" }}>
        <p>Nenhum patrocinador adicionado ainda</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {sponsors.map((sponsor: any) => (
        <a
          key={sponsor.id}
          href={sponsor.url || "#"}
          target={sponsor.url ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className="flex items-center justify-center p-4 rounded-lg transition hover:opacity-80"
          style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
        >
          <img src={sponsor.logo} alt={sponsor.name} className="max-w-full max-h-16 object-contain" />
        </a>
      ))}
    </div>
  );
}

function AdminProfileSection() {
  const { data: adminProfile } = trpc.adminProfile.get.useQuery();

  if (!adminProfile || !adminProfile.name) {
    return null;
  }

  return (
    <section className="py-12 md:py-16" style={{ backgroundColor: "var(--background)" }}>
      <div className="container flex items-center justify-center gap-6">
        {adminProfile.logo && (
          <img
            src={adminProfile.logo}
            alt={adminProfile.name}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
          />
        )}
        <div>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Apresentado por
          </p>
          <h3 className="text-lg md:text-xl font-bold" style={{ color: "var(--foreground)", fontFamily: "'Sora', sans-serif" }}>
            {adminProfile.name}
          </h3>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { isAdmin, adminToken } = useAdminAuth();

  const { data: episodes = [], refetch } = trpc.episodes.list.useQuery();
  const recentEpisodes = episodes.slice(0, 3);

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

          {/* Desktop nav */}
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
                className="text-sm font-medium hover:opacity-70 transition"
                style={{ color: "var(--foreground)" }}
              >
                Sobre
              </span>
            </Link>
            {isAdmin ? (
              <Link href="/admin/dashboard">
                <Button
                  size="sm"
                  className="gap-1"
                  style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  Portal Do Adm
                </Button>
              </Link>
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

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ color: "var(--foreground)" }}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
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
                style={{ color: "var(--foreground)" }}
              >
                Sobre
              </span>
            </Link>
            {isAdmin ? (
              <Link href="/admin/dashboard">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  Portal Do Adm
                </Button>
              </Link>
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
        className="py-20 md:py-32 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(0, 217, 255, 0.05) 0%, rgba(255, 107, 53, 0.05) 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute top-20 right-20 w-72 h-72 rounded-full blur-3xl"
            style={{ background: "rgba(0, 217, 255, 0.1)" }}
          />
          <div
            className="absolute bottom-20 left-20 w-72 h-72 rounded-full blur-3xl"
            style={{ background: "rgba(255, 107, 53, 0.1)" }}
          />
        </div>

        <div className="container relative z-10">
          <div className="max-w-2xl">
            <div
              className="inline-block px-4 py-2 rounded-full mb-6 border"
              style={{
                backgroundColor: "rgba(0, 217, 255, 0.08)",
                borderColor: "rgba(0, 217, 255, 0.3)",
              }}
            >
              <span style={{ color: "var(--primary)" }} className="text-xs md:text-sm font-medium">
                ⚡ Análise em Tempo Real
              </span>
            </div>
            <h1
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              style={{ color: "var(--foreground)", fontFamily: "'Sora', sans-serif" }}
            >
              Política e Negócios em Profundidade
            </h1>
            <p
              className="text-base md:text-lg mb-8 opacity-80 leading-relaxed"
              style={{ color: "var(--foreground)" }}
            >
              Entrevistas exclusivas com especialistas, análises de mercado e insights que transformam
              sua visão sobre os temas que movem o Brasil.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link href="/episodes">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2 font-semibold"
                  style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  Ouvir Agora
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto gap-2 font-semibold"
                style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
              >
                <MessageCircle className="w-5 h-5" />
                Comunidade
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: "var(--background)" }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <TrendingUp className="w-6 h-6" style={{ color: "var(--primary)" }} />,
                title: "Análises de Mercado",
                desc: "Tendências econômicas e oportunidades com visão estratégica",
              },
              {
                icon: <Users className="w-6 h-6" style={{ color: "var(--accent)" }} />,
                title: "Especialistas",
                desc: "Líderes, economistas e formadores de opinião do Brasil",
              },
              {
                icon: <Zap className="w-6 h-6" style={{ color: "var(--primary)" }} />,
                title: "Insights Exclusivos",
                desc: "Perspectivas únicas que você não encontra em outro lugar",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 md:p-8 rounded-xl border transition-all hover:border-primary/50"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
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
                  className="text-lg md:text-xl font-bold mb-2"
                  style={{ color: "var(--foreground)", fontFamily: "'Sora', sans-serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm md:text-base" style={{ color: "var(--muted-foreground)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Episodes */}
      <section
        className="py-16 md:py-24"
        style={{ backgroundColor: "rgba(0, 217, 255, 0.02)" }}
      >
        <div className="container">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <h2
                className="text-2xl md:text-4xl font-bold mb-2"
                style={{ color: "var(--foreground)", fontFamily: "'Sora', sans-serif" }}
              >
                Episódios Recentes
              </h2>
              <p className="text-sm md:text-base" style={{ color: "var(--muted-foreground)" }}>
                Os últimos conteúdos publicados
              </p>
            </div>
            <Link href="/episodes">
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex gap-1"
                style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
              >
                Ver todos
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {recentEpisodes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentEpisodes.map((episode) => (
                <Link key={episode.id} href="/episodes">
                  <Card
                    className="overflow-hidden hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer"
                    style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
                  >
                    <div className="video-container">
                      <iframe
                        src={getEmbedUrl(episode.videoUrl)}
                        title={episode.title}
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                    <div className="p-4 md:p-5">
                      <p className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
                        {formatDate(episode.publishedAt)}
                      </p>
                      <h3
                        className="text-base font-bold mb-2 line-clamp-2"
                        style={{ color: "var(--foreground)", fontFamily: "'Sora', sans-serif" }}
                      >
                        {episode.title}
                      </h3>
                      <p className="text-xs line-clamp-2" style={{ color: "var(--muted-foreground)" }}>
                        {episode.description || "Sem descrição"}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Play
                className="w-12 h-12 mx-auto mb-4 opacity-30"
                style={{ color: "var(--primary)" }}
              />
              <p className="text-lg font-medium mb-2" style={{ color: "var(--foreground)" }}>
                Nenhum episódio publicado ainda
              </p>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                Os episódios aparecerão aqui assim que forem publicados.
              </p>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link href="/episodes">
              <Button
                variant="outline"
                style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
              >
                Ver todos os episódios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: "var(--card)" }}>
        <div className="container">
          <h2
            className="text-2xl md:text-3xl font-bold mb-12 text-center"
            style={{ color: "var(--foreground)", fontFamily: "'Sora', sans-serif" }}
          >
            Nossos Patrocinadores
          </h2>
          <SponsorsSection />
        </div>
      </section>

      {/* Admin Profile Section */}
      <AdminProfileSection />

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
            Faça Parte da Nossa Comunidade
          </h2>
          <p
            className="text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto opacity-80"
            style={{ color: "var(--foreground)" }}
          >
            Receba notificações sobre novos episódios e participe de discussões exclusivas
          </p>
          <Button
            size="lg"
            className="gap-2 w-full sm:w-auto font-semibold"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}
          >
            <MessageCircle className="w-5 h-5" />
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
                <span
                  className="font-bold text-base"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  Política & Negócios
                </span>
              </div>
              <p className="text-xs md:text-sm opacity-80">
                Análises profundas sobre os temas que movem o Brasil
              </p>
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
          refetch();
        }}
        adminToken={adminToken || ""}
      />
    </div>
  );
}
