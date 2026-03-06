import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  LogOut,
  Plus,
  AlertCircle,
  CheckCircle,
  Pencil,
  Trash2,
  Play,
  X,
  Save,
  Users,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const ADMIN_TOKEN = "admin-secret-token";

interface FormData {
  title: string;
  description: string;
  videoUrl: string;
}

interface SponsorForm {
  name: string;
  logo: string;
  url: string;
}

interface AdminProfileForm {
  name: string;
  logo: string;
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { isAdmin, logout: adminLogout } = useAdminAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<"episodes" | "sponsors" | "profile">("episodes");
  const [formData, setFormData] = useState<FormData>({ title: "", description: "", videoUrl: "" });
  const [sponsorForm, setSponsorForm] = useState<SponsorForm>({ name: "", logo: "", url: "" });
  const [profileForm, setProfileForm] = useState<AdminProfileForm>({ name: "", logo: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FormData>({ title: "", description: "", videoUrl: "" });

  const checkAuthQuery = trpc.admin.checkAuth.useQuery();
  const { data: episodes = [], refetch } = trpc.episodes.list.useQuery();
  const { data: sponsors = [] } = trpc.sponsors.list.useQuery();
  const { data: adminProfile } = trpc.adminProfile.get.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.episodes.create.useMutation({
    onSuccess: () => {
      toast.success("Episódio criado com sucesso!");
      setFormData({ title: "", description: "", videoUrl: "" });
      setSuccessMessage("Episódio publicado com sucesso!");
      setTimeout(() => setSuccessMessage(""), 3000);
      utils.episodes.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.episodes.update.useMutation({
    onSuccess: () => {
      toast.success("Episódio atualizado!");
      setEditingId(null);
      utils.episodes.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.episodes.delete.useMutation({
    onSuccess: () => {
      toast.success("Episódio removido!");
      utils.episodes.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const createSponsorMutation = trpc.sponsors.create.useMutation({
    onSuccess: () => {
      toast.success("Patrocinador adicionado!");
      setSponsorForm({ name: "", logo: "", url: "" });
      utils.sponsors.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteSponsorMutation = trpc.sponsors.delete.useMutation({
    onSuccess: () => {
      toast.success("Patrocinador removido!");
      utils.sponsors.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateProfileMutation = trpc.adminProfile.update.useMutation({
    onSuccess: () => {
      toast.success("Perfil atualizado!");
      utils.adminProfile.get.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const logoutMutation = trpc.admin.logout.useMutation({
    onSuccess: () => {
      adminLogout();
      toast.success("Desconectado com sucesso!");
      setLocation("/admin");
    },
  });

  useEffect(() => {
    if (checkAuthQuery.data !== undefined) {
      if (!checkAuthQuery.data.isAuthenticated && !isAdmin) {
        setLocation("/admin");
      }
      setIsCheckingAuth(false);
    }
  }, [checkAuthQuery.data, isAdmin, setLocation]);

  useEffect(() => {
    if (adminProfile) {
      setProfileForm({ name: adminProfile.name || "", logo: adminProfile.logo || "" });
    }
  }, [adminProfile]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!isAdmin && !checkAuthQuery.data?.isAuthenticated) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.videoUrl.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({ ...formData, adminToken: ADMIN_TOKEN });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editForm.title.trim() || !editForm.description.trim() || !editForm.videoUrl.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }
    await updateMutation.mutateAsync({ id, ...editForm, adminToken: ADMIN_TOKEN });
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Deseja remover o episódio "${title}"?`)) return;
    await deleteMutation.mutateAsync({ id, adminToken: ADMIN_TOKEN });
  };

  const handleCreateSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorForm.name.trim() || !sponsorForm.logo.trim()) {
      toast.error("Preencha nome e logo do patrocinador");
      return;
    }
    await createSponsorMutation.mutateAsync({ ...sponsorForm, adminToken: ADMIN_TOKEN });
  };

  const handleDeleteSponsor = async (id: number, name: string) => {
    if (!confirm(`Deseja remover o patrocinador "${name}"?`)) return;
    await deleteSponsorMutation.mutateAsync({ id, adminToken: ADMIN_TOKEN });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error("Preencha o nome do administrador");
      return;
    }
    await updateProfileMutation.mutateAsync({ ...profileForm, adminToken: ADMIN_TOKEN });
  };

  const startEdit = (ep: any) => {
    setEditingId(ep.id);
    setEditForm({ title: ep.title, description: ep.description || "", videoUrl: ep.videoUrl });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #00d9ff 0%, #ff6b35 100%)",
                }}
              >
                <Play className="w-4 h-4 fill-white text-white" />
              </div>
            </Link>
            <div>
              <h1
                className="text-base font-bold leading-none"
                style={{ color: "var(--foreground)", fontFamily: "'Sora', sans-serif" }}
              >
                Painel Administrativo
              </h1>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Política & Negócios
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            className="gap-2"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </header>

      <div className="container py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b" style={{ borderColor: "var(--border)" }}>
          {[
            { id: "episodes", label: "Episódios", icon: Play },
            { id: "sponsors", label: "Patrocinadores", icon: Users },
            { id: "profile", label: "Perfil", icon: User },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition ${
                activeTab === id ? "border-b-2" : "border-b-transparent"
              }`}
              style={{
                color: activeTab === id ? "var(--primary)" : "var(--muted-foreground)",
                borderBottomColor: activeTab === id ? "var(--primary)" : "transparent",
              }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Episodes Tab */}
        {activeTab === "episodes" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                <h2 className="text-xl font-bold mb-5 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                  <Plus className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  Adicionar Novo Episódio
                </h2>

                {successMessage && (
                  <div
                    className="flex items-center gap-2 p-3 rounded-lg mb-4 text-sm"
                    style={{
                      backgroundColor: "rgba(46,125,50,0.08)",
                      border: "1px solid rgba(46,125,50,0.3)",
                      color: "#2e7d32",
                    }}
                  >
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    {successMessage}
                  </div>
                )}

                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                      Título do Episódio *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                      placeholder="Ex: Análise das Eleições 2024"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                      Descrição *
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Descreva o conteúdo do episódio..."
                      rows={4}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                      Link do Vídeo (YouTube ou Spotify) *
                    </label>
                    <Input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData((p) => ({ ...p, videoUrl: e.target.value }))}
                      placeholder="https://www.youtube.com/watch?v=..."
                      disabled={isSubmitting}
                    />
                    <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                      Aceita links do YouTube e Spotify
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full"
                    style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
                  >
                    {isSubmitting ? "Publicando..." : "Publicar Episódio"}
                  </Button>
                </form>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="p-5" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>
                  Total de Episódios
                </p>
                <p className="text-4xl font-bold" style={{ color: "var(--foreground)" }}>
                  {episodes.length}
                </p>
              </Card>

              <Card
                className="p-5"
                style={{
                  backgroundColor: "rgba(0, 217, 255, 0.05)",
                  border: "1px solid rgba(0, 217, 255, 0.2)",
                }}
              >
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "var(--primary)" }} />
                  <div>
                    <h4 className="font-medium text-sm mb-1" style={{ color: "var(--foreground)" }}>
                      Dica
                    </h4>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      Use URLs diretas do YouTube ou Spotify para melhor compatibilidade de embed.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Episodes List */}
        {activeTab === "episodes" && (
          <div className="mt-10">
            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--foreground)" }}>
              Episódios Publicados
            </h2>
            <div className="space-y-3">
              {episodes.map((ep: any) => (
                <Card
                  key={ep.id}
                  className="p-4"
                  style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
                >
                  {editingId === ep.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editForm.title}
                        onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                        placeholder="Título"
                      />
                      <Textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                        placeholder="Descrição"
                        rows={3}
                      />
                      <Input
                        type="url"
                        value={editForm.videoUrl}
                        onChange={(e) => setEditForm((p) => ({ ...p, videoUrl: e.target.value }))}
                        placeholder="URL do vídeo"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdate(ep.id)}
                          style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Salvar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                          style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold" style={{ color: "var(--foreground)" }}>
                          {ep.title}
                        </h3>
                        <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                          {ep.description}
                        </p>
                        <p className="text-xs mt-2" style={{ color: "var(--muted-foreground)" }}>
                          Publicado em {formatDate(ep.publishedAt)}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(ep)}
                          style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(ep.id, ep.title)}
                          style={{ borderColor: "var(--destructive)", color: "var(--destructive)" }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Sponsors Tab */}
        {activeTab === "sponsors" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                <h2 className="text-xl font-bold mb-5 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                  <Plus className="w-5 h-5" style={{ color: "var(--accent)" }} />
                  Adicionar Patrocinador
                </h2>

                <form onSubmit={handleCreateSponsor} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                      Nome do Patrocinador *
                    </label>
                    <Input
                      value={sponsorForm.name}
                      onChange={(e) => setSponsorForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Ex: Empresa XYZ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                      URL do Logo *
                    </label>
                    <Input
                      type="url"
                      value={sponsorForm.logo}
                      onChange={(e) => setSponsorForm((p) => ({ ...p, logo: e.target.value }))}
                      placeholder="https://exemplo.com/logo.png"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                      Site do Patrocinador (opcional)
                    </label>
                    <Input
                      type="url"
                      value={sponsorForm.url}
                      onChange={(e) => setSponsorForm((p) => ({ ...p, url: e.target.value }))}
                      placeholder="https://www.exemplo.com"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}
                  >
                    Adicionar Patrocinador
                  </Button>
                </form>
              </Card>
            </div>

            <div>
              <Card className="p-5" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>
                  Total de Patrocinadores
                </p>
                <p className="text-4xl font-bold" style={{ color: "var(--foreground)" }}>
                  {sponsors.length}
                </p>
              </Card>
            </div>
          </div>
        )}

        {/* Sponsors List */}
        {activeTab === "sponsors" && (
          <div className="mt-10">
            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--foreground)" }}>
              Patrocinadores Ativos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sponsors.map((sponsor: any) => (
                <Card
                  key={sponsor.id}
                  className="p-4 flex flex-col items-center text-center"
                  style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
                >
                  <img src={sponsor.logo} alt={sponsor.name} className="w-20 h-20 object-contain mb-3" />
                  <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
                    {sponsor.name}
                  </h3>
                  {sponsor.url && (
                    <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="text-xs mt-2" style={{ color: "var(--primary)" }}>
                      Visitar site
                    </a>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteSponsor(sponsor.id, sponsor.name)}
                    className="mt-3 w-full"
                    style={{ borderColor: "var(--destructive)", color: "var(--destructive)" }}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remover
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="max-w-2xl">
            <Card className="p-6" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                <User className="w-5 h-5" style={{ color: "var(--primary)" }} />
                Perfil do Administrador
              </h2>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                    Nome do Administrador *
                  </label>
                  <Input
                    value={profileForm.name}
                    onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                    URL do Logo (opcional)
                  </label>
                  <Input
                    type="url"
                    value={profileForm.logo}
                    onChange={(e) => setProfileForm((p) => ({ ...p, logo: e.target.value }))}
                    placeholder="https://exemplo.com/seu-logo.png"
                  />
                  {profileForm.logo && (
                    <img src={profileForm.logo} alt="Preview" className="w-20 h-20 object-contain mt-3" />
                  )}
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  Atualizar Perfil
                </Button>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
