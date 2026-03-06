import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  createEpisode,
  createSponsor,
  deleteEpisode,
  deleteSponsor,
  getAllEpisodes,
  getAllSponsors,
  getAdminProfile,
  initializeDefaultAdmin,
  updateAdminProfile,
  updateEpisode,
  verifyAdminCredentials,
} from "./db";

const ADMIN_TOKEN = "admin-secret-token";
const ADMIN_COOKIE = "adminToken";

// Ensure default admin exists on startup
initializeDefaultAdmin().catch(console.error);

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  episodes: router({
    list: publicProcedure.query(async () => {
      return await getAllEpisodes();
    }),

    create: publicProcedure
      .input(
        z.object({
          title: z.string().min(1, "Título é obrigatório"),
          description: z.string().min(1, "Descrição é obrigatória"),
          videoUrl: z.string().url("URL do vídeo inválida"),
          adminToken: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        if (input.adminToken !== ADMIN_TOKEN) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Acesso negado." });
        }
        try {
          await createEpisode({
            title: input.title,
            description: input.description,
            videoUrl: input.videoUrl,
          });
          return { success: true, message: "Episódio criado com sucesso" };
        } catch {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erro ao criar episódio" });
        }
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).optional(),
          description: z.string().min(1).optional(),
          videoUrl: z.string().url().optional(),
          adminToken: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        if (input.adminToken !== ADMIN_TOKEN) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Acesso negado." });
        }
        try {
          const data: Record<string, string> = {};
          if (input.title) data.title = input.title;
          if (input.description) data.description = input.description;
          if (input.videoUrl) data.videoUrl = input.videoUrl;
          await updateEpisode(input.id, data);
          return { success: true, message: "Episódio atualizado com sucesso" };
        } catch {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erro ao atualizar episódio" });
        }
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number(), adminToken: z.string() }))
      .mutation(async ({ input }) => {
        if (input.adminToken !== ADMIN_TOKEN) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Acesso negado." });
        }
        try {
          await deleteEpisode(input.id);
          return { success: true, message: "Episódio deletado com sucesso" };
        } catch {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erro ao deletar episódio" });
        }
      }),
  }),

  admin: router({
    login: publicProcedure
      .input(z.object({ username: z.string(), password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const isValid = await verifyAdminCredentials(input.username, input.password);
        if (!isValid) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Usuário ou senha inválidos" });
        }
        ctx.res.cookie(ADMIN_COOKIE, ADMIN_TOKEN, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        });
        return { success: true };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(ADMIN_COOKIE, { path: "/" });
      return { success: true };
    }),

    checkAuth: publicProcedure.query(({ ctx }) => {
      const token = (ctx.req as any).cookies?.[ADMIN_COOKIE];
      return { isAuthenticated: token === ADMIN_TOKEN };
    }),
  }),

  sponsors: router({
    list: publicProcedure.query(async () => {
      return await getAllSponsors();
    }),

    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Nome do patrocinador é obrigatório"),
          logo: z.string().url("URL do logo inválida"),
          url: z.string().url("URL do site inválida").optional(),
          adminToken: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        if (input.adminToken !== ADMIN_TOKEN) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Acesso negado." });
        }
        try {
          await createSponsor({
            name: input.name,
            logo: input.logo,
            url: input.url,
          });
          return { success: true, message: "Patrocinador adicionado com sucesso" };
        } catch {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erro ao adicionar patrocinador" });
        }
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number(), adminToken: z.string() }))
      .mutation(async ({ input }) => {
        if (input.adminToken !== ADMIN_TOKEN) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Acesso negado." });
        }
        try {
          await deleteSponsor(input.id);
          return { success: true, message: "Patrocinador removido com sucesso" };
        } catch {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erro ao remover patrocinador" });
        }
      }),
  }),

  adminProfile: router({
    get: publicProcedure.query(async () => {
      return await getAdminProfile();
    }),

    update: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Nome é obrigatório").optional(),
          logo: z.string().url("URL do logo inválida").optional(),
          adminToken: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        if (input.adminToken !== ADMIN_TOKEN) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Acesso negado." });
        }
        try {
          await updateAdminProfile({
            name: input.name,
            logo: input.logo,
          });
          return { success: true, message: "Perfil do administrador atualizado com sucesso" };
        } catch {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erro ao atualizar perfil" });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
