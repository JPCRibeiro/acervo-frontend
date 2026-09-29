export type Role = "OWNER" | "MEMBER";

export type AccessTokenResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
};

export type AccessTokenClaims = {
  sub: string;
  organizationId: string;
  role: Role;
  exp: number;
  iat: number;
  iss: string;
};

export type OrganizationSummary = {
  id: string;
  name: string;
  role: Role;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type Snippet = {
  text: string;
  page: number | null;
  score: number;
}

export type SourceCitation = {
  documentId: string;
  fileName: string;
  url: string | null;
  topScore: number;
  snippets: Snippet[];
}

export type ChatStreamResponse = {
  conversationId: string | null;
  textDelta: string;
  sources: SourceCitation[] | null;
}

export type ChatMessage =
  | { id: string; role: "user"; content: string }
  | {
      id: string;
      role: "assistant";
      content: string;
      sources: SourceCitation[];
};

export type DocumentStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED';

export type DocumentSummary = {
  id: string;
  fileName: string;
  status: DocumentStatus;
  chunkCount: number;
  fileSizeBytes: number;
  uploadedAt: string;
  failureReason: string | null;
}

export type IngestionResponse = {
  documentId: string;
  fileName: string;
  status: DocumentStatus;
}

export type InviteCode = {
  inviteCode: string;
}

export type ConversationSummary = {
  id: string;
  title: string;
  updatedAt: string;
};

export type ConversationRole = "USER" | "ASSISTANT";

export type ConversationMessage = {
  id: string;
  role: ConversationRole;
  content: string;
  sources: SourceCitation[];
  createdAt: string;
};

export type ConversationDetail = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ConversationMessage[];
};