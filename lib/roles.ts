export type SystemRole = "super_admin" | "admin" | "organizer" | "judge" | "participant";
export type RoleView = "admin" | "organizer" | "judge" | "participant";
export type PublicSignupRole = "organizer" | "participant";

export type RoleProfile = {
  role: SystemRole;
  roles: SystemRole[];
  active_view: RoleView;
  available_views: RoleView[];
  role_label: string;
  invite_only: boolean;
};

export type BayForgeUser = Record<string, unknown> & {
  id?: string;
  sub?: string;
  user_id?: string;
  email?: string;
  display_name?: string;
  name?: string;
} & RoleProfile;

export type BayForgeSessionUser = RoleProfile & {
  id?: string;
  email?: string;
  display_name?: string;
  name?: string;
};

const ROLE_LABELS: Record<SystemRole, string> = {
  super_admin: "Super admin",
  admin: "Admin",
  organizer: "Organizer",
  judge: "Judge",
  participant: "Participant",
};

const ROLE_PRIORITY: SystemRole[] = [
  "super_admin",
  "admin",
  "judge",
  "organizer",
  "participant",
];

const ROLE_ALIASES: Record<string, SystemRole> = {
  superadmin: "super_admin",
  super_admin: "super_admin",
  owner: "super_admin",
  admin: "admin",
  administrator: "admin",
  organizer: "organizer",
  organiser: "organizer",
  host: "organizer",
  judge: "judge",
  reviewer: "judge",
  participant: "participant",
  attendee: "participant",
  builder: "participant",
  member: "participant",
};

const INVITE_ONLY_ROLES = new Set<SystemRole>(["super_admin", "admin", "judge"]);
const PUBLIC_SIGNUP_ROLES = new Set<PublicSignupRole>(["organizer", "participant"]);

const DIRECT_ROLE_FIELDS = [
  "role",
  "primary_role",
  "primaryRole",
  "user_role",
  "userRole",
  "account_type",
  "accountType",
  "bayforge_role",
  "bayforgeRole",
  "invited_role",
  "invitedRole",
];

const ROLE_LIST_FIELDS = [
  "roles",
  "available_roles",
  "availableRoles",
  "bayforge_roles",
  "bayforgeRoles",
];

const NESTED_ROLE_FIELDS = [
  "metadata",
  "profile",
  "app_metadata",
  "appMetadata",
  "user_metadata",
  "userMetadata",
  "custom_claims",
  "customClaims",
];

export function parseSystemRole(value: unknown): SystemRole | null {
  if (typeof value === "string") {
    const key = value.trim().toLowerCase().replace(/[\s-]+/g, "_");
    return ROLE_ALIASES[key] ?? null;
  }

  if (isRecord(value)) {
    for (const candidate of [value.role, value.name, value.key, value.slug]) {
      if (typeof candidate === "string") {
        const role = parseSystemRole(candidate);
        if (role) return role;
      }
    }
  }

  return null;
}

export function parseRoleView(value: unknown): RoleView | null {
  const role = parseSystemRole(value);
  if (!role) return null;
  return roleToView(role);
}

export function parsePublicSignupRole(value: unknown): PublicSignupRole | null {
  const role = parseSystemRole(value);
  return role && isPublicSignupRole(role) ? role : null;
}

export function sanitizePublicSignupRole(value: unknown): PublicSignupRole {
  return parsePublicSignupRole(value) ?? "participant";
}

export function isInviteOnlyRole(role: SystemRole | null): boolean {
  return role ? INVITE_ONLY_ROLES.has(role) : false;
}

export function collectRequestedSignupRoles(body: Record<string, unknown>): SystemRole[] {
  return collectExplicitRoles(body);
}

export function sanitizeSignupRolePayload(
  body: Record<string, unknown>,
  signupRole: PublicSignupRole
): Record<string, unknown> {
  const cleanBody = stripRoleFields(body);
  cleanBody.role = signupRole;
  return cleanBody;
}

export function decorateUserWithRoles(
  rawUser: unknown,
  fallbackPublicRole?: unknown,
  preferredView?: unknown
): BayForgeUser | null {
  if (!isRecord(rawUser)) return null;

  const explicitRoles = collectExplicitRoles(rawUser);
  const fallbackRole = parsePublicSignupRole(fallbackPublicRole);
  const roles = uniqueRoles([
    ...explicitRoles,
    ...(fallbackRole && explicitRoles.length === 0 ? [fallbackRole] : []),
  ]);

  if (!roles.length) {
    roles.push("participant");
  }

  const availableViews = getAvailableViews(roles);
  const requestedView = parseRoleView(preferredView);
  const activeView =
    requestedView && availableViews.includes(requestedView)
      ? requestedView
      : roleToView(getPrimaryRole(roles));

  const primaryRole = getPrimaryRole(roles);

  return {
    ...rawUser,
    role: primaryRole,
    roles,
    active_view: activeView,
    available_views: availableViews,
    role_label: ROLE_LABELS[primaryRole],
    invite_only: roles.some((role) => INVITE_ONLY_ROLES.has(role)),
  };
}

export function getRoleLabel(role: SystemRole): string {
  return ROLE_LABELS[role];
}

export function canAccessRoleView(
  user: Pick<RoleProfile, "available_views">,
  view: RoleView
): boolean {
  return user.available_views.includes(view);
}

export function toSessionUser(user: BayForgeUser): BayForgeSessionUser {
  return {
    id: firstString(user.id, user.user_id, user.sub),
    email: firstString(user.email),
    display_name: firstString(user.display_name),
    name: firstString(user.name),
    role: user.role,
    roles: user.roles,
    active_view: user.active_view,
    available_views: user.available_views,
    role_label: user.role_label,
    invite_only: user.invite_only,
  };
}

function collectExplicitRoles(record: Record<string, unknown>, depth = 0): SystemRole[] {
  const roles: SystemRole[] = [];

  for (const field of DIRECT_ROLE_FIELDS) {
    addRoleValues(roles, record[field]);
  }

  for (const field of ROLE_LIST_FIELDS) {
    addRoleValues(roles, record[field]);
  }

  if (depth < 3) {
    for (const field of NESTED_ROLE_FIELDS) {
      const nested = record[field];
      if (isRecord(nested)) {
        roles.push(...collectExplicitRoles(nested, depth + 1));
      }
    }
  }

  return uniqueRoles(roles);
}

function stripRoleFields(body: Record<string, unknown>): Record<string, unknown> {
  const cleanBody: Record<string, unknown> = { ...body };

  for (const field of DIRECT_ROLE_FIELDS) {
    delete cleanBody[field];
  }
  for (const field of ROLE_LIST_FIELDS) {
    delete cleanBody[field];
  }

  for (const field of NESTED_ROLE_FIELDS) {
    const nested = cleanBody[field];
    if (isRecord(nested)) {
      cleanBody[field] = stripRoleFields(nested);
    }
  }

  return cleanBody;
}

function addRoleValues(target: SystemRole[], value: unknown) {
  if (Array.isArray(value)) {
    for (const item of value) {
      const role = parseSystemRole(item);
      if (role) target.push(role);
    }
    return;
  }

  const role = parseSystemRole(value);
  if (role) target.push(role);
}

function getPrimaryRole(roles: SystemRole[]): SystemRole {
  return ROLE_PRIORITY.find((role) => roles.includes(role)) ?? "participant";
}

function getAvailableViews(roles: SystemRole[]): RoleView[] {
  const views: RoleView[] = [];

  if (roles.includes("super_admin") || roles.includes("admin")) {
    views.push("admin");
  }
  if (roles.includes("judge")) {
    views.push("judge");
  }
  if (roles.includes("organizer")) {
    views.push("organizer", "participant");
  }
  if (roles.includes("participant")) {
    views.push("participant");
  }

  return uniqueViews(views.length ? views : ["participant"]);
}

function roleToView(role: SystemRole): RoleView {
  if (role === "super_admin" || role === "admin") return "admin";
  return role;
}

function isPublicSignupRole(role: SystemRole): role is PublicSignupRole {
  return PUBLIC_SIGNUP_ROLES.has(role as PublicSignupRole);
}

function uniqueRoles(roles: SystemRole[]): SystemRole[] {
  return ROLE_PRIORITY.filter((role) => roles.includes(role));
}

function uniqueViews(views: RoleView[]): RoleView[] {
  const seen = new Set<RoleView>();
  const unique: RoleView[] = [];
  for (const view of views) {
    if (!seen.has(view)) {
      seen.add(view);
      unique.push(view);
    }
  }
  return unique;
}

function firstString(...values: unknown[]): string | undefined {
  return values.find(
    (value): value is string => typeof value === "string" && value.trim().length > 0
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
