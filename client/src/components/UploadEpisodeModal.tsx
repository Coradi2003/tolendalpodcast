import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  adminToken: string;
}

export default function UploadEpisodeModal({ isOpen, onClose, onSuccess, adminToken }: Props) {
  const [form, setForm] = useState({ title: "", description: "", videoUrl: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createMutation = trpc.episodes.create.useMutation({
    onSuccess: () => {
      toast.success("Episódio publicado com sucesso!");
      setForm({ title: "", description: "", videoUrl: "" });
      onSuccess();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.videoUrl.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({ ...form, adminToken });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg" style={{ backgroundColor: "var(--card)" }}>
        <DialogHeader>
          <DialogTitle
            className="flex items-center gap-2 text-xl"
            style={{ color: "var(--foreground)" }}
          >
            <Plus className="w-5 h-5" style={{ color: "var(--primary)" }} />
            Adicionar Episódio
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
              Título *
            </label>
            <Input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Ex: Análise das Eleições 2024"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
              Descrição *
            </label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Descreva o conteúdo do episódio..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
              Link do Vídeo (YouTube ou Spotify) *
            </label>
            <Input
              type="url"
              value={form.videoUrl}
              onChange={(e) => setForm((p) => ({ ...p, videoUrl: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=..."
              disabled={isSubmitting}
            />
            <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
              Aceita links do YouTube e Spotify
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
              style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {isSubmitting ? "Publicando..." : "Publicar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
