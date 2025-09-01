import { ChangeEvent } from "react";
import { IImageData, IUploadedImage, IImageUploadResponse } from "./common";

/**
 * 이미지 관련 특화 타입 및 인터페이스 정의
 * (공통 타입은 common.d.ts에서 관리)
 */

// === 레거시 호환성을 위한 타입 별칭 ===
export type IImageObject = IImageData;

// === 이미지 업로더 컴포넌트 Props ===
export interface IImageUploaderComponentProps {
  images: IImageData[];
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleImageDelete: (index: number) => void;
  error?: string;
}

// === 이미지 관련 훅 타입 ===
export interface IUseImageUploadReturn {
  images: IImageData[];
  uploadImage: (file: File) => Promise<string>;
  removeImage: (index: number) => void;
  isUploading: boolean;
  error: string | null;
}
