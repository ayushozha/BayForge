import assert from "node:assert/strict";
import test from "node:test";
import { loginPath, safeReturnPath } from "../lib/authRedirect";
import {
  canAccessRoleView,
  collectRequestedSignupRoles,
  decorateUserWithRoles,
  parseSystemRole,
  sanitizeSignupRolePayload,
  toSessionUser,
} from "../lib/roles";

test("normalizes supported role aliases", () => {
  assert.equal(parseSystemRole("super-admin"), "super_admin");
  assert.equal(parseSystemRole("organiser"), "organizer");
  assert.equal(parseSystemRole({ slug: "reviewer" }), "judge");
  assert.equal(parseSystemRole("unknown"), null);

  const circular: Record<string, unknown> = {};
  circular.role = circular;
  assert.equal(parseSystemRole(circular), null);
});

test("builds authorized views from trusted roles", () => {
  const organizer = decorateUserWithRoles(
    { id: "user-1", role: "organizer" },
    undefined,
    "participant"
  );
  assert.ok(organizer);
  assert.deepEqual(organizer.roles, ["organizer"]);
  assert.deepEqual(organizer.available_views, ["organizer", "participant"]);
  assert.equal(organizer.active_view, "participant");

  const forgedView = decorateUserWithRoles(
    { id: "user-2", role: "participant" },
    undefined,
    "admin"
  );
  assert.ok(forgedView);
  assert.equal(forgedView.active_view, "participant");
  assert.equal(canAccessRoleView(forgedView, "admin"), false);
});

test("rejects crafted privileged signup role requests and strips role fields", () => {
  const body = {
    email: "builder@example.com",
    role: "participant",
    roles: ["organizer"],
    metadata: {
      invitedRole: "judge",
      profile: { role: "admin" },
      theme: "dark",
    },
  };

  assert.deepEqual(collectRequestedSignupRoles(body), [
    "admin",
    "judge",
    "organizer",
    "participant",
  ]);

  assert.deepEqual(sanitizeSignupRolePayload(body, "participant"), {
    email: "builder@example.com",
    role: "participant",
    metadata: {
      profile: {},
      theme: "dark",
    },
  });
});

test("returns a minimal session DTO", () => {
  const user = decorateUserWithRoles({
    sub: "auth-user-1",
    email: "judge@example.com",
    display_name: "Grace Hopper",
    role: "judge",
    secret_claim: "must-not-leak",
  });
  assert.ok(user);

  assert.deepEqual(toSessionUser(user), {
    id: "auth-user-1",
    email: "judge@example.com",
    display_name: "Grace Hopper",
    name: undefined,
    role: "judge",
    roles: ["judge"],
    active_view: "judge",
    available_views: ["judge"],
    role_label: "Judge",
    invite_only: true,
  });
});

test("keeps post-login redirects on the Bay Forge origin", () => {
  assert.equal(
    safeReturnPath("/dashboard?tab=access#roles"),
    "/dashboard?tab=access#roles"
  );
  assert.equal(safeReturnPath("https://evil.example"), "/dashboard");
  assert.equal(safeReturnPath("//evil.example"), "/dashboard");
  assert.equal(safeReturnPath("/\\evil.example"), "/dashboard");
  assert.equal(safeReturnPath("/%5Cevil.example"), "/dashboard");
  assert.equal(safeReturnPath("/%2F%2Fevil.example"), "/dashboard");
  assert.equal(safeReturnPath("/dashboard\r\nLocation: /admin"), "/dashboard");
  assert.equal(loginPath("/dashboard"), "/login?from=%2Fdashboard");
});
