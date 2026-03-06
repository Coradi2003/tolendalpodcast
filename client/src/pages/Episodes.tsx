import { useEffect, useState } from "react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Menu, X, Search } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface Episode {
  id: number;
  title: string;
  description: string;
  video_url: string;
  created_at: string;
}

function getEmbedUrl(url: string): string {
  if (!url) return "";

  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );

  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  if (url.includes("spotify.com")) {
    return url
      .replace("open.spotify.com", "open.spotify.com/embed")
      .replace("/episode/", "/embed/episode/");
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

export default function Episodes() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAdminAuth();

  useEffect(() => {
    loadEpisodes();
  }, []);

  async function loadEpisodes() {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("episodes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setEpisodes(data || []);
    } catch (err) {
      console.error("Erro ao carregar episódios:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const filtered = episodes.filter(
    (ep) =>
      ep.title.toLowerCase().includes(search.toLowerCase()) ||
      (ep.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
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
                className="text-sm font-medium border-b-2 pb-0.5"
                style={{ color: "var(--primary)", borderColor: "var(--primary)" }}
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

            {!isAdmin && (
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
                style={{ color: "var(--primary)" }}
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

            {!isAdmin && (
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

      <section
        className="py-12 md:py-16 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%)",
        }}
      >
        <div className="container">
          <h1
            className="text-3xl md:text-5xl font-bold mb-3"
            style={{ color: "var(--foreground)", fontFamily: "'Sora', sans-serif" }}
          >
            Todos os Episódios
          </h1>
          <p style={{ color: "var(--muted-foreground)" }}>
            {episodes.length} episódio{episodes.length !== 1 ? "s" : ""} publicado
            {episodes.length !== 1 ? "s" : ""}
          </p>
        </div>
      </section>

      <div className="container py-6">
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--muted-foreground)" }}
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar episódios..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="container pb-16">
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-lg font-medium" style={{ color: "var(--foreground)" }}>
              Carregando episódios...
            </p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((episode) => (
              <Card
                key={episode.id}
                className="overflow-hidden hover:shadow-lg transition-all hover:border-primary/50"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
              >
                <div className="video-container">
                  <iframe
                    src={getEmbedUrl(episode.video_url)}
                    title={episode.title}
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>

                <div className="p-4 md:p-5">
                  <p className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
                    {formatDate(episode.created_at)}
                  </p>

                  <h3
                    className="text-base font-bold mb-2 line-clamp-2"
                    style={{ color: "var(--foreground)", fontFamily: "'Sora', sans-serif" }}
                  >
                    {episode.title}
                  </h3>

                  <p className="text-xs line-clamp-3" style={{ color: "var(--muted-foreground)" }}>
                    {episode.description || "Sem descrição"}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Play
              className="w-14 h-14 mx-auto mb-4 opacity-20"
              style={{ color: "var(--primary)" }}
            />
            <p className="text-lg font-medium mb-2" style={{ color: "var(--foreground)" }}>
              {search ? "Nenhum episódio encontrado" : "Nenhum episódio publicado ainda"}
            </p>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              {search
                ? "Tente buscar com outros termos"
                : "Os episódios aparecerão aqui assim que forem publicados."}
            </p>
          </div>
        )}
      </div>

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
    </div>
  );
}