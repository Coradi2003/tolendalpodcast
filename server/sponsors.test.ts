import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "test",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
      cookies: {},
    } as TrpcContext["req"],
    res: {
      cookie: () => {},
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("sponsors", () => {
  it("lists sponsors (empty initially)", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sponsors.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("creates a sponsor with valid token", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sponsors.create({
      name: "Test Sponsor",
      logo: "https://example.com/logo.png",
      url: "https://example.com",
      adminToken: "admin-secret-token",
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("sucesso");
  });

  it("rejects sponsor creation with invalid token", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.sponsors.create({
        name: "Test Sponsor",
        logo: "https://example.com/logo.png",
        url: "https://example.com",
        adminToken: "wrong-token",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});

describe("adminProfile", () => {
  it("gets admin profile", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.adminProfile.get();

    expect(result === undefined || typeof result === "object").toBe(true);
  });

  it("updates admin profile with valid token", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.adminProfile.update({
      name: "Admin Name",
      logo: "https://example.com/admin-logo.png",
      adminToken: "admin-secret-token",
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("sucesso");
  });

  it("rejects profile update with invalid token", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.adminProfile.update({
        name: "Admin Name",
        logo: "https://example.com/admin-logo.png",
        adminToken: "wrong-token",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});
