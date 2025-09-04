import { useState } from "react";
import { useRouter } from "next/navigation";
import { logger } from "@/utils/logger";

import { updateComment, deleteComment } from "@/lib/api/comments/commentsApi";
import { deleteProduct } from "@/lib/api/products/productsApi";
import { updateArticle, deleteArticle } from "@/lib/api/articles/articlesApi";

interface IUseDropdownActionsProps {
  type: "product" | "article" | "comment";
  itemId: number;
  onDelete?: () => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onToast?: (
    message: string,
    type: "success" | "error" | "warning" | "info"
  ) => void;
}

export const useDropdownActions = ({
  type,
  itemId,
  onDelete,
  onSuccess,
  onError,
  onToast,
}: IUseDropdownActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  /**
   * 수정 처리 함수
   */
  const handleEdit = async (content?: string, title?: string) => {
    if (!itemId) {
      onError?.("아이템 ID가 없습니다.");
      return;
    }

    setIsLoading(true);

    try {
      if (type === "product") {
        router.push(`/products/${itemId.toString()}/edit`);
        return;
      } else if (type === "article") {
        router.push(`/articles/${itemId.toString()}/edit`);
        return;
      } else if (type === "comment") {
        if (!content) {
          onError?.("수정할 내용을 입력해주세요.");
          return;
        }

        await updateComment(itemId, content);
        // 수정 성공 시 토스트로 알림
        onToast?.("댓글이 성공적으로 수정되었습니다.", "success");
        window.location.reload();
        // 페이지 새로고침 대신 부모 컴포넌트에서 처리하도록 함
      }
    } catch (error) {
      logger.error("수정 실패:", error);
      const errorMessage =
        error instanceof Error ? error.message : "수정에 실패했습니다.";
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 삭제 처리 함수
   */
  const handleDelete = async () => {
    if (!itemId) {
      onError?.("아이템 ID가 없습니다.");
      return;
    }

    setIsLoading(true);

    try {
      switch (type) {
        case "product": {
          await deleteProduct(itemId.toString());
          // 삭제 성공 시 토스트 알림
          onToast?.("상품이 삭제되었습니다.", "success");
          router.push("/products");
          break;
        }
        case "comment": {
          await deleteComment(itemId);
          // 삭제 성공 시 토스트 알림
          onToast?.("댓글이 삭제되었습니다.", "success");
          if (onDelete) onDelete();
          break;
        }
        case "article": {
          await deleteArticle(itemId);
          // 삭제 성공 시 토스트 알림
          onToast?.("글이 삭제되었습니다.", "success");
          if (onDelete) onDelete();
          router.push("/articles");
          break;
        }
        default:
          onError?.("지원하지 않는 타입입니다.");
          break;
      }
    } catch (error) {
      logger.error("삭제 실패:", error);
      const errorMessage =
        error instanceof Error ? error.message : "삭제에 실패했습니다.";
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleEdit,
    handleDelete,
    isLoading,
  };
};
