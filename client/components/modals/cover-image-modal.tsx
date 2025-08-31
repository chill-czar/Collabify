"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useConverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "@/components/editor/notes/single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DialogTitle } from '@radix-ui/react-dialog';
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export function CoverImageModal() {
  const update = useMutation(api.documents.update);
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const coverImage = useConverImage();
  const { edgestore } = useEdgeStore();
  const currentNoteId = useSelector(
    (state: RootState) => state.currentNoteId.noteId
  ) as Id<"documents"> | null;
    
  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      const response = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverImage.url,
        },
      });

      await update({
        id: currentNoteId as Id<"documents">,
        coverImage: response.url,
      });

      onClose();
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
           Cover Image
          </DialogTitle>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
}
