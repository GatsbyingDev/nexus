import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/stores/authStore";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type LoginInput = z.infer<typeof schema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: LoginInput): Promise<void> => {
    try {
      const { data } = await api.post<{
        success: boolean;
        data?: {
          accessToken: string;
          user: {
            _id: string;
            username: string;
            email: string;
            displayName: string;
            status: "online" | "idle" | "dnd" | "invisible";
            friends: { userId: string; status: "pending" | "accepted" | "blocked" }[];
            createdAt: string;
            updatedAt: string;
          };
        };
      }>("/auth/login", values);

      if (!data.success || !data.data) {
        toast.error("Unable to login");
        return;
      }

      setToken(data.data.accessToken);
      setUser(data.data.user);
      toast.success("Welcome back");
      navigate("/channels/@me");
    } catch {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="grid h-full place-items-center bg-surface-container-lowest p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-2xl border border-outline-variant bg-surface-container p-6">
        <h1 className="font-headline text-2xl text-on-surface">Welcome to Nexus</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Sign in to continue</p>

        <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Email</label>
        <input
          {...register("email")}
          className="mt-1 w-full rounded-md border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none focus:border-primary-container"
          placeholder="you@example.com"
        />
        {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}

        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Password</label>
        <input
          {...register("password")}
          type="password"
          className="mt-1 w-full rounded-md border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none focus:border-primary-container"
          placeholder="••••••••"
        />
        {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-md bg-primary-container px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>

        <p className="mt-4 text-sm text-on-surface-variant">
          Need an account? <Link to="/register" className="text-primary">Register</Link>
        </p>
      </form>
    </div>
  );
};
