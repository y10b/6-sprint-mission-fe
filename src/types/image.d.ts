import { ChangeEvent } from "react";

export type IImageObject = {
  file: File;
  url: string;
};

export interface ImageUploaderProps {
  images: IImageObject[];
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleImageDelete: (index: number) => void;
  error?: string;
}
