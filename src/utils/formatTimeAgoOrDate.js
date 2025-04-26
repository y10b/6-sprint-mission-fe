export function formatTimeAgoOrDate(dateString) {
    const createdAt = new Date(dateString);
    const now = new Date();
    const diffMs = now - createdAt;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
        const hours = Math.floor(diffHours);
        if (hours < 1) {
            const minutes = Math.floor(diffMs / (1000 * 60));
            return `${minutes}분 전`;
        }
        return `${hours}시간 전`;
    } else {
        return createdAt.toLocaleString();
    }
}
