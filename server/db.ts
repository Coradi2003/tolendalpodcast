import { createHash } from "crypto";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { adminCredentials, adminProfile, episodes, sponsors, users, type InsertAdminProfile, type InsertEpisode, type InsertSponsor, type InsertUser } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Password helpers ────────────────────────────────────────────────────────

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

// ─── Episodes ────────────────────────────────────────────────────────────────

export async function getAllEpisodes() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(episodes).orderBy(desc(episodes.publishedAt));
  } catch (error) {
    console.error("[Database] Failed to get episodes:", error);
    return [];
  }
}

export async function getEpisodeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  try {
    const result = await db.select().from(episodes).where(eq(episodes.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get episode:", error);
    return undefined;
  }
}

export async function createEpisode(data: InsertEpisode) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const result = await db.insert(episodes).values(data);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create episode:", error);
    throw error;
  }
}

export async function updateEpisode(id: number, data: Partial<InsertEpisode>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    return await db.update(episodes).set(data).where(eq(episodes.id, id));
  } catch (error) {
    console.error("[Database] Failed to update episode:", error);
    throw error;
  }
}

export async function deleteEpisode(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    return await db.delete(episodes).where(eq(episodes.id, id));
  } catch (error) {
    console.error("[Database] Failed to delete episode:", error);
    throw error;
  }
}

// ─── Admin credentials ───────────────────────────────────────────────────────

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  try {
    const result = await db
      .select()
      .from(adminCredentials)
      .where(eq(adminCredentials.username, username))
      .limit(1);
    if (result.length === 0) return false;
    return result[0].passwordHash === hashPassword(password);
  } catch (error) {
    console.error("[Database] Failed to verify admin:", error);
    return false;
  }
}

export async function initializeDefaultAdmin() {
  const db = await getDb();
  if (!db) return;
  try {
    const existing = await db
      .select()
      .from(adminCredentials)
      .where(eq(adminCredentials.username, "admin"))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(adminCredentials).values({
        username: "admin",
        passwordHash: hashPassword("0000"),
      });
      console.log("[Database] Default admin credentials initialized (admin/0000)");
    }
  } catch (error) {
    console.error("[Database] Failed to initialize admin:", error);
  }
}

// ─── Admin Profile ──────────────────────────────────────────────────────────

export async function getAdminProfile() {
  const db = await getDb();
  if (!db) return undefined;
  try {
    const result = await db.select().from(adminProfile).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get admin profile:", error);
    return undefined;
  }
}

export async function updateAdminProfile(data: Partial<InsertAdminProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const existing = await db.select().from(adminProfile).limit(1);
    if (existing.length === 0) {
      await db.insert(adminProfile).values({
        name: data.name || "Administrador",
        logo: data.logo,
      });
    } else {
      await db.update(adminProfile).set(data);
    }
  } catch (error) {
    console.error("[Database] Failed to update admin profile:", error);
    throw error;
  }
}

// ─── Sponsors ───────────────────────────────────────────────────────────────

export async function getAllSponsors() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(sponsors).orderBy(desc(sponsors.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get sponsors:", error);
    return [];
  }
}

export async function createSponsor(data: InsertSponsor) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const result = await db.insert(sponsors).values(data);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create sponsor:", error);
    throw error;
  }
}

export async function deleteSponsor(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    return await db.delete(sponsors).where(eq(sponsors.id, id));
  } catch (error) {
    console.error("[Database] Failed to delete sponsor:", error);
    throw error;
  }
}
