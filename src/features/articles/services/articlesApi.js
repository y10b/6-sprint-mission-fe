export async function updateArticle(baseUrl, parentId, itemId, content) {
    const res = await fetch(`${baseUrl}/${parentId}/${itemId || ""}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "글 수정 실패");
    }

    return await res.json();
}

export async function deleteArticle(baseUrl, parentId, itemId) {
    const url = itemId
        ? `${baseUrl}/${parentId}/${itemId}`
        : `${baseUrl}/${parentId}`;

    const res = await fetch(url, {
        method: "DELETE",
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "글 삭제 실패");
    }

    return await res.json();
}
