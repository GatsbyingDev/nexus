import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReplyPreview } from "./ReplyPreview";

const schema = z.object({
  content: z.string().min(1).max(2000)
});

type FormInput = z.infer<typeof schema>;

interface MessageInputProps {
  disabled?: boolean;
  onSend: (content: string) => Promise<void>;
}

export const MessageInput = ({ disabled = false, onSend }: MessageInputProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<FormInput>({ resolver: zodResolver(schema) });

  return (
    <form
      className="border-t border-outline-variant p-4"
      onSubmit={handleSubmit(async (values) => {
        await onSend(values.content);
        reset();
      })}
    >
      <ReplyPreview />
      <div className="mt-2 flex items-center gap-2 rounded-lg bg-surface-container-low px-3 py-2">
        <input
          {...register("content")}
          disabled={disabled || isSubmitting}
          className="flex-1 bg-transparent text-sm outline-none"
          placeholder={disabled ? "Select a channel to chat" : "Message channel"}
        />
        <button type="submit" disabled={disabled || isSubmitting} className="rounded bg-primary-container px-3 py-1 text-xs font-semibold text-white disabled:opacity-60">
          Send
        </button>
      </div>
    </form>
  );
};
