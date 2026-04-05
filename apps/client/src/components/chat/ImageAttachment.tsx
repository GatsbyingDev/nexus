interface ImageAttachmentProps {
  url: string;
  alt?: string;
}

export const ImageAttachment = ({ url, alt = "attachment" }: ImageAttachmentProps) => {
  return (
    <a href={url} target="_blank" rel="noreferrer" className="block max-w-sm overflow-hidden rounded-md border border-outline-variant">
      <img src={url} alt={alt} className="h-auto w-full object-cover" />
    </a>
  );
};
