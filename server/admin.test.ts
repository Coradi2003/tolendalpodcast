import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Helpers ────────────────────────────────────────────────────────────────

type CookieCall = { name: string; value?: string; options?: Record<string, unknown> };

function createCtx(adminCookie?: string) {
  const cookies: CookieCall[] = [];
  const clearedCookies: CookieCall[] = [];

  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
      cookies: adminCookie ? { adminToken: adminCookie } : {},
    } as unknown as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string, options: Record<string, unknown>) => {
        cookies.push({ name, value, options });
      },
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as unknown as TrpcContext["res"],
  };

  return { ctx, cookies, clearedCookies };
}

// ─── admin.checkAuth ─────────────────────────────────────────────────────────

describe("admin.checkAuth", () => {
  it("returns isAuthenticated=false when no cookie is present", async () => {
    const { ctx } = createCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.checkAuth();
    expect(result.isAuthenticated).toBe(false);
  });

  it("returns isAuthenticated=true when valid admin cookie is present", async () => {
    const { ctx } = createCtx("admin-secret-token");
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.checkAuth();
    expect(result.isAuthenticated).toBe(true);
  });

  it("returns isAuthenticated=false when cookie value is wrong", async () => {
    const { ctx } = createCtx("wrong-token");
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.checkAuth();
    expect(result.isAuthenticated).toBe(false);
  });
});

// ─── admin.logout ────────────────────────────────────────────────────────────

describe("admin.logout", () => {
  it("clears the adminToken cookie and returns success", async () => {
    const { ctx, clearedCookies } = createCtx("admin-secret-token");
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe("adminToken");
  });
});

// ─── episodes.list ───────────────────────────────────────────────────────────

describe("episodes.list", () => {
  it("returns an array (possibly empty)", async () => {
    const { ctx } = createCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.episodes.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

// ─── episodes.create ─────────────────────────────────────────────────────────

describe("episodes.create", () => {
  it("throws UNAUTHORIZED when adminToken is wrong", async () => {
    const { ctx } = createCtx();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.episodes.create({
        title: "Test",
        description: "Desc",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        adminToken: "wrong-token",
      })
    ).rejects.toThrow("Acesso negado.");
  });
});

// ─── auth.logout ─────────────────────────────────────────────────────────────

describe("auth.logout (session cookie)", () => {
  it("clears the session cookie and reports success", async () => {
    const { ctx, clearedCookies } = createCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies.length).toBeGreaterThanOrEqual(1);
  });
});
