import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export type LoginFormType = z.infer<typeof loginSchema>;

const account = {
  name: z.string().trim().min(1, 'Nome é obrigatório'),
  email: z.email('Email inválido'),
  password: z.string().min(8, 'Mínimo de 8 caracteres'),
};

export const registerSchema = z.object({
  ...account,
  organizationName: z.string().trim().min(1, 'Nome da organização é obrigatório'),
});

export type RegisterFormType = z.infer<typeof registerSchema>;

export const joinSchema = z.object({
  ...account,
  inviteCode: z.string().trim().min(1, 'Código de convite é obrigatório'),
});
export type JoinFormType = z.infer<typeof joinSchema>;