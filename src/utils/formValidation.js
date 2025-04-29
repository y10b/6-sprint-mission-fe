export const validateProductName = (name) => {
    return name.length >= 2 && name.length <= 15;
};

export const validateDescription = (description) => {
    return description.length >= 10 && description.length <= 100;
};

export const validatePrice = (price) => {
    return parseFloat(price) > 0;
};

export const validateTags = (tags) => {
    return tags.length > 0;
};