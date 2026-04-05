import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "@/lib/axios";

const schema = z.object({
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(1).max(100)
});

type RegisterInput = z.infer<typeof schema>;

export const RegisterPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterInput>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: RegisterInput): Promise<void> => {
    try {
      const { data } = await api.post<{ success: boolean }>("/auth/register", values);

      if (!data.success) {
        toast.error("Registration failed");
        return;
      }

      toast.success("Account created");
      navigate("/login");
    } catch {
      toast.error("Unable to create account");
    }
  };

  return (
    <div className="grid h-full place-items-center bg-surface-container-lowest p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-2xl border border-outline-variant bg-surface-container p-6">
        <h1 className="font-headline text-2xl text-on-surface">Create your Nexus account</h1>

        <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Display Name</label>
        <input {...register("displayName")} className="mt-1 w-full rounded-md border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none focus:border-primary-container" />
        {errors.displayName && <p className="mt-1 text-xs text-error">{errors.displayName.message}</p>}

        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Username</label>
        <input {...register("username")} className="mt-1 w-full rounded-md border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none focus:border-primary-container" />
        {errors.username && <p className="mt-1 text-xs text-error">Invalid username</p>}

        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Email</label>
        <input {...register("email")} className="mt-1 w-full rounded-md border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none focus:border-primary-container" />
        {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}

        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Password</label>
        <input {...register("password")} type="password" className="mt-1 w-full rounded-md border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none focus:border-primary-container" />
        {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}

        <button type="submit" disabled={isSubmitting} className="mt-6 w-full rounded-md bg-primary-container px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {isSubmitting ? "Creating..." : "Create account"}
        </button>

        <p className="mt-4 text-sm text-on-surface-variant">
          Already have an account? <Link to="/login" className="text-primary">Sign in</Link>
        </p>
      </form>
    </div>
  );
};
