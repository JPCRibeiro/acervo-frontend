import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth";
import { ApiError } from "@/lib/api/errors";
import { joinSchema, type JoinFormType } from "@/features/auth/schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export default function JoinPage() {
  const joinOrg = useAuthStore((s) => s.join);
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinFormType>({ resolver: zodResolver(joinSchema) });

  const onSubmit = async (data: JoinFormType) => {
    setFormError(null);
    try {
      await joinOrg(data);
      navigate("/", { replace: true });
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Erro ao entrar com convite",
      );
    }
  };

  return (
    <>
      <div className="mb-6 space-y-1">
        <h1 className="text-xl font-semibold text-card-foreground">
          Entrar com convite
        </h1>
        <p className="text-sm text-muted-foreground">
          Junte-se a uma organização existente
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="inviteCode">Código de convite</FieldLabel>
            <Input
              id="inviteCode"
              aria-invalid={!!errors.inviteCode}
              {...register("inviteCode")}
            />
            {errors.inviteCode && (
              <FieldError>{errors.inviteCode.message}</FieldError>
            )}
          </Field>

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
            Entrar
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Quer criar sua própria organização?{" "}
        <Link
          to="/cadastro"
          className="text-foreground underline underline-offset-4"
        >
          Criar conta
        </Link>
      </p>
    </>
  );
}
