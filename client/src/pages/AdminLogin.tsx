import { useState } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Play, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { login } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: () => {
      login("admin-secret-token");
      toast.success("Login realizado com sucesso!");
      setLocation("/admin/dashboard");
    },
    onError: (err) => {
      setError(err.message);
      toast.error(err.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Preencha todos os campos");
      return;
    }
    setIsLoading(true);
    try {
      await loginMutation.mutateAsync({ username, password });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{
        backgroundColor: "var(--background)",
        background: "linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%)",
      }}
    >
      {/* Background blurs */}
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

      {/* Logo */}
      <div className="mb-8 text-center relative z-10">
        <Link href="/">
          <div className="flex items-center gap-3 justify-center mb-3 cursor-pointer">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #00d9ff 0%, #ff6b35 100%)",
              }}
            >
              <Play className="w-6 h-6 fill-white text-white" />
            </div>
            <span
              className="text-2xl font-bold"
              style={{ color: "var(--foreground)", fontFamily: "'Sora', sans-serif" }}
            >
              Política & Negócios
            </span>
          </div>
        </Link>
        <p style={{ color: "var(--muted-foreground)" }} className="text-sm">
          Área Administrativa
        </p>
      </div>

      {/* Card */}
      <Card
        className="w-full max-w-md backdrop-blur-md relative z-10"
        style={{
          backgroundColor: "rgba(26, 31, 46, 0.8)",
          border: "1px solid rgba(0, 217, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 217, 255, 0.1)",
        }}
      >
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(0, 217, 255, 0.2) 0%, rgba(255, 107, 53, 0.2) 100%)",
              }}
            >
              <Lock className="w-5 h-5" style={{ color: "var(--primary)" }} />
            </div>
            <div>
              <h1
                className="text-xl font-bold"
                style={{ color: "var(--foreground)", fontFamily: "'Sora', sans-serif" }}
              >
                Acesso Administrativo
              </h1>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Entre com suas credenciais
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="flex items-center gap-2 p-3 rounded-lg text-sm"
                style={{
                  backgroundColor: "rgba(255, 85, 85, 0.08)",
                  border: "1px solid rgba(255, 85, 85, 0.3)",
                  color: "var(--destructive)",
                }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--foreground)" }}
              >
                Usuário
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--foreground)" }}
              >
                Senha
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••"
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-base font-semibold"
              style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div
            className="mt-6 pt-5 border-t text-center"
            style={{ borderColor: "var(--border)" }}
          >
            <Link href="/">
              <span
                className="text-sm hover:opacity-70 transition cursor-pointer"
                style={{ color: "var(--primary)" }}
              >
                ← Voltar ao site
              </span>
            </Link>
          </div>
        </div>
      </Card>

      <p className="mt-6 text-xs relative z-10" style={{ color: "var(--muted-foreground)" }}>
        &copy; 2024 Política & Negócios em Profundidade
      </p>
    </div>
  );
}
