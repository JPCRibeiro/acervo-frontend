export type Role = 'OWNER' | 'MEMBER';

export type AccessTokenResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export type AccessTokenClaims = {
  sub: string;
  organizationId: string;
  role: Role;
  exp: number;
  iat: number;
  iss: string;
}

export type OrganizationSummary = {
  id: string;
  name: string;
  role: Role;
}

export type UserProfile = {
  id: string;
  name: string;
  email: string;
}

export type Member = {
  id: string;
  name: string;
  email: string;
  role: Role;
}