import type { FC } from "react";
import { ComposerPrimitive } from "@assistant-ui/react";
import { ComposerAttachments } from "@/components/assistant-ui/attachment";
import { ComposerAction } from "./composer-action";

export type ComposerProps = {
  placeholder?: string;
  attachmentsEnabled?: boolean;
};

export const Composer: FC<ComposerProps> = ({
  placeholder = "Send a message...",
  attachmentsEnabled = true,
}) => {
  return (
    <ComposerPrimitive.Root className="aui-composer-root relative flex w-full flex-col">
      <ComposerPrimitive.AttachmentDropzone className="aui-composer-attachment-dropzone flex w-full flex-col rounded-3xl border border-input bg-background px-1 pt-2 shadow-xs outline-none transition-[color,box-shadow] has-[textarea:focus-visible]:border-ring has-[textarea:focus-visible]:ring-[3px] has-[textarea:focus-visible]:ring-ring/50 data-[dragging=true]:border-ring data-[dragging=true]:border-dashed data-[dragging=true]:bg-accent/50 dark:bg-background">
        {attachmentsEnabled && <ComposerAttachments />}
        <ComposerPrimitive.Input
          placeholder={placeholder}
          className="aui-composer-input mb-1 max-h-32 min-h-16 w-full resize-none bg-transparent px-3.5 pt-1.5 pb-3 text-base outline-none placeholder:text-muted-foreground focus-visible:ring-0"
          rows={1}
          autoFocus
          aria-label="Message input"
        />
        <ComposerAction attachmentsEnabled={attachmentsEnabled} />
      </ComposerPrimitive.AttachmentDropzone>
    </ComposerPrimitive.Root>
  );
};
