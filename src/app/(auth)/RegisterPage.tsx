import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth";
import { ApiError } from "@/lib/api/errors";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { registerSchema, type RegisterFormType } from "@/features/auth/schema";

export default function RegisterPage() {
  const registerAccount = useAuthStore((s) => s.register);
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormType>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormType) => {
    setFormError(null);
    try {
      await registerAccount(data);
      navigate("/", { replace: true });
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Erro ao criar conta",
      );
    }
  };

  return (
    <>
      <div className="mb-6 space-y-1">
        <h1 className="text-xl font-semibold text-card-foreground">
          Criar conta
        </h1>
        <p className="text-sm text-muted-foreground">
          Crie sua organização no Acervo
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Nome</FieldLabel>
            <Input
              id="name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="organizationName">Organização</FieldLabel>
            <Input
              id="organizationName"
              aria-invalid={!!errors.organizationName}
              {...register("organizationName")}
            />
            {errors.organizationName && (
              <FieldError>{errors.organizationName.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <FieldError>{errors.password.message}</FieldError>
            )}
          </Field>

          {formError && <FieldError>{formError}</FieldError>}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            Criar conta
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link
          to="/entrar"
          className="text-foreground underline underline-offset-4"
        >
          Entrar
        </Link>
        {" · "}
        <Link
          to="/juntar"
          className="text-foreground underline underline-offset-4"
        >
          Tenho um convite
        </Link>
      </p>
    </>
  );
}
