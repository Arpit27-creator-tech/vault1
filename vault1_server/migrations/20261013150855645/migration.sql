BEGIN;

--
-- ACTION CREATE TABLE
--
CREATE TABLE "vault_otps" (
    "id" bigserial PRIMARY KEY,
    "email" text NOT NULL,
    "code" text NOT NULL,
    "expiresAt" timestamp without time zone NOT NULL
);

-- Indexes
CREATE INDEX "vault_otps_email_idx" ON "vault_otps" USING btree ("email");

--
-- ACTION CREATE TABLE
--
CREATE TABLE "vault_users" (
    "id" bigserial PRIMARY KEY,
    "callsign" text NOT NULL,
    "email" text NOT NULL,
    "passwordHash" text NOT NULL,
    "xp" bigint NOT NULL DEFAULT 0,
    "level" bigint NOT NULL DEFAULT 1,
    "vaultRole" text NOT NULL DEFAULT 'Canopy Hacker'::text,
    "rank" text NOT NULL DEFAULT 'Junior Ranger'::text,
    "avatarUrl" text,
    "missionsCompleted" bigint NOT NULL DEFAULT 0,
    "vaultsCracked" bigint NOT NULL DEFAULT 0,
    "alarmsTripped" bigint NOT NULL DEFAULT 0,
    "winRate" double precision NOT NULL DEFAULT 100.0,
    "fastestTime" text NOT NULL DEFAULT '--'::text,
    "csMastery" bigint NOT NULL DEFAULT 75,
    "physicsMastery" bigint NOT NULL DEFAULT 70,
    "chemMastery" bigint NOT NULL DEFAULT 70,
    "mathMastery" bigint NOT NULL DEFAULT 75,
    "badges" json
);

-- Indexes
CREATE UNIQUE INDEX "vault_users_email_unique" ON "vault_users" USING btree ("email");
CREATE UNIQUE INDEX "vault_users_callsign_unique" ON "vault_users" USING btree ("callsign");


--
-- MIGRATION VERSION FOR vault1
--
INSERT INTO "serverpod_migrations" ("module", "version", "timestamp")
    VALUES ('vault1', '20261013150855645', now())
    ON CONFLICT ("module")
    DO UPDATE SET "version" = '20261013150855645', "timestamp" = now();

--
-- MIGRATION VERSION FOR serverpod
--
INSERT INTO "serverpod_migrations" ("module", "version", "timestamp")
    VALUES ('serverpod', '20260824182259319', now())
    ON CONFLICT ("module")
    DO UPDATE SET "version" = '20260824182259319', "timestamp" = now();

--
-- MIGRATION VERSION FOR serverpod_auth_idp
--
INSERT INTO "serverpod_migrations" ("module", "version", "timestamp")
    VALUES ('serverpod_auth_idp', '20260924105404509', now())
    ON CONFLICT ("module")
    DO UPDATE SET "version" = '20260924105404509', "timestamp" = now();

--
-- MIGRATION VERSION FOR serverpod_auth_core
--
INSERT INTO "serverpod_migrations" ("module", "version", "timestamp")
    VALUES ('serverpod_auth_core', '20260924105232991', now())
    ON CONFLICT ("module")
    DO UPDATE SET "version" = '20260924105232991', "timestamp" = now();


COMMIT;
