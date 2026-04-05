import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { api } from "@/lib/axios";
import { Modal } from "./Modal";

const schema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(512).optional()
});

type FormValues = z.infer<typeof schema>;

interface CreateServerModalProps {
  onClose: () => void;
}

export const CreateServerModal = ({ onClose }: CreateServerModalProps) => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <Modal onClose={onClose}>
      <h3 className="font-headline text-xl">Create a Server</h3>
      <form
        className="mt-4 space-y-3"
        onSubmit={handleSubmit(async (values) => {
          try {
            await api.post("/servers", values);
            toast.success("Server created");
            onClose();
          } catch {
            toast.error("Failed to create server");
          }
        })}
      >
        <input {...register("name")} placeholder="Server name" className="w-full rounded border border-outline-variant bg-surface-container-low px-3 py-2 text-sm" />
        <textarea {...register("description")} placeholder="Description" className="w-full rounded border border-outline-variant bg-surface-container-low px-3 py-2 text-sm" />
        <button disabled={isSubmitting} className="rounded bg-primary-container px-3 py-2 text-sm font-semibold text-white">Create</button>
      </form>
    </Modal>
  );
};
