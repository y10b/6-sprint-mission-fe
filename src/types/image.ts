import { ChangeEvent } from "react";

export type ImageObject = {
  file: File;
  url: string;
};

export interface ImageUploaderProps {
  images: ImageObject[];
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleImageDelete: (index: number) => void;
  error?: string;
}
