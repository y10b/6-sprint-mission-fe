const BASE_URL = "https://panda-market-api.vercel.app";
const accessToken = localStorage.getItem('accessToken');

// 유효성 검사 함수
const validateProductData = (productData) => {
    // 필수 필드가 빠지지 않았는지 확인
    if (!productData.name || !productData.price || !productData.tags || !productData.images) {
        console.error('Missing required fields: name, price, tags, and images are required.');
        return false;
    }

    // 가격이 숫자인지 확인
    if (isNaN(productData.price)) {
        console.error('Price must be a valid number.');
        return false;
    }

    // 추가적인 유효성 검사 로직을 여기에 작성할 수 있음

    return true;
};


export const createProduct = async (productData) => {
    try {
        // 유효성 검사
        if (!validateProductData(productData)) {
            return;
        }

        // accessToken이 있는지 확인
        if (!accessToken) {
            console.error('Authorization token is missing. Please log in.');
            return;
        }

        // API 호출
        const response = await fetch(`${BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(productData), // 상품 데이터를 JSON 형식으로 전송
        });

        const data = await response.json();

        // 응답 처리
        if (response.ok) {
            console.log('Product created successfully', data);
            return { success: true, data }; // 성공적인 응답 처리
        } else {
            console.error('Product creation failed', data.message, data.details);
            return { success: false, error: data.message }; // 실패 응답 처리
        }
    } catch (error) {
        console.error('Error creating product', error);
        return { success: false, error: error.message }; // 오류 처리
    }
};

