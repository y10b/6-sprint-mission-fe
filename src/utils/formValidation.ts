export const validateProductName = (name: string) => {
  return name.length >= 2 && name.length <= 15;
};

export const validateDescription = (description: string) => {
  return description.length >= 10 && description.length <= 100;
};

export const validatePrice = (price: number) => {
  return price > 0;
};

export const validateTags = (tags: string[]) => {
  return tags.length > 0;
};
