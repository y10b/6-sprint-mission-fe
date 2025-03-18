const validateName = (name) => {
    const trimmedName = name.trim();
    if (trimmedName.length < 1 || trimmedName.length > 10) {
        return "상품명은 1자 이상, 10자 이하이어야 합니다.";
    }
    return "";
};

const validateDescription = (description) => {
    const trimmedDescription = description.trim();
    if (trimmedDescription.length < 10 || description.length > 100) {
        return "상품 소개는 10자 이상, 100자 이하이어야 합니다.";
    }
    return "";
};

const validatePrice = (price) => {
    if (price < 1) {
        return "판매 가격은 1원 이상이어야 합니다.";
    }
    return "";
};

const validateTags = (tags) => {
    if (tags.length > 3) {
        return "태그는 3개 이하로 입력해야 합니다.";
    }
    return "";
};

export const validateProduct = (name, description, price, tags) => {
    return {
        nameError: validateName(name),
        descriptionError: validateDescription(description),
        priceError: validatePrice(price),
        tagsError: validateTags(tags),
    };
};
