import { useState } from 'react';

const useFormValidation = () => {
    const [nameError, setNameError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [tagsError, setTagsError] = useState('');

    // 상품명 유효성 검사 (1자 이상, 10자 이내)
    const validateName = (name) => {
        if (name.length < 1 || name.length > 10) {
            setNameError('상품명은 1자 이상, 10자 이하이어야 합니다.');
            return false;
        }
        setNameError('');
        return true;
    };

    // 상품 소개 유효성 검사 (10자 이상, 100자 이내)
    const validateDescription = (description) => {
        if (description.length < 10 || description.length > 100) {
            setDescriptionError('상품 소개는 10자 이상, 100자 이하이어야 합니다.');
            return false;
        }
        setDescriptionError('');
        return true;
    };

    // 판매 가격 유효성 검사 (숫자만)
    const validatePrice = (price) => {
        if (!price || isNaN(price) || price <= 0) {
            setPriceError('판매 가격은 숫자여야 합니다.');
            return false;
        }
        setPriceError('');
        return true;
    };

    // 태그 유효성 검사 
    const validateTags = (tags) => {
        if (tags.length > 3) {
            setTagsError('태그는 3개 이하로 입력해야 합니다.');
            return false;
        }
        setTagsError('');
        return true;
    };

    // 모든 유효성 검사 통과 여부 확인
    const isFormValid = () => {
        return nameError === '' && descriptionError === '' && priceError === '' && tagsError === '';
    };

    return {
        nameError,
        descriptionError,
        priceError,
        tagsError,
        validateName,
        validateDescription,
        validatePrice,
        validateTags,
        isFormValid,
    };
};

export default useFormValidation;
