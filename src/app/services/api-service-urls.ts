export enum API {
    GET_ALL_ACTIVE_CATEGORIES_URL  = "https://localhost:5001/Api/Categories/All?$filter=IsActive eq true",
    GET_ALL_CATEGORIES_URL  = "https://localhost:5001/Api/Categories/All",
    GET_CATEGORY_BY_ID_URL  = "https://localhost:5001/Api/Categories/All?$filter Id eq ",
    ADD_CATEGORY_URL  = "https://localhost:5001/Api/Categories/Add",
    UPDATE_CATEGORY_URL  = "https://localhost:5001/Api/Categories/Update",
    ACTIVATE_CATEGORY_URL  = "https://localhost:5001/Api/Categories/Activate/",
    DEACTIVATE_CATEGORY_URL  = "https://localhost:5001/Api/Categories/Deactivate/",


    GET_ALL_ACTIVE_PRODUCTS_URL  = "https://localhost:5001/Api/Products/All?$filter=IsActive eq true & $expand=Category",
    GET_ALL_PRODUCTS_URL  = "https://localhost:5001/Api/Products/All?$expand=Category",
    GET_PRODUCT_BY_ID_URL  = "https://localhost:5001/Api/Products/All?$filter=Id eq ",
    ADD_PRODUCT_URL  = "https://localhost:5001/Api/Products/Add",
    UPDATE_PRODUCT_URL  = "https://localhost:5001/Api/Products/Update",
    ACTIVATE_PRODUCT_URL  = "https://localhost:5001/Api/Products/Activate/",
    DEACTIVATE_PRODUCT_URL  = "https://localhost:5001/Api/Products/Deactivate/"
};