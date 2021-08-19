export enum API {
    GET_ALL_ACTIVE_CATEGORIES_URL  = "https://localhost:5001/Api/Categories/All?$filter=IsActive eq true",
    GET_ALL_CATEGORIES_URL  = "https://localhost:5001/Api/Categories/All",
    GET_CATEGORY_BY_ID_URL  = "https://localhost:5001/Api/Categories/All?$filter Id eq ",
    ADD_CATEGORY_URL  = "https://localhost:5001/Api/Categories/Add",
    UPDATE_CATEGORY_URL  = "https://localhost:5001/Api/Categories/Update",
    ACTIVATE_CATEGORY_URL  = "https://localhost:5001/Api/Categories/Activate/",
    DEACTIVATE_CATEGORY_URL  = "https://localhost:5001/Api/Categories/Deactivate/",


    GET_ALL_PRODUCTS_URL  = "https://localhost:5001/Api/Products/All",
    GET_PRODUCT_BY_ID_URL  = "https://localhost:5001/Api/Products/All",
    ADD_PRODUCT_URL  = "https://localhost:5001/Api/Products/Add",
    UPDATE_PRODUCT_URL  = "https://localhost:5001/Api/Products/Update",
    ACTIVATE_PRODUCT_URL  = "https://localhost:5001/Api/Products/Activate/",
    DEACTIVATE_PRODUCT_URL  = "https://localhost:5001/Api/Products/Deactivate/",

    GET_CART_BY_USER  = "https://localhost:5001/Api/ShoppingCart/User/",
    GET_CART_BY_ID  = "https://localhost:5001/Api/ShoppingCart/",
    ADD_CART_URL  = "https://localhost:5001/Api/ShoppingCart/Add",
    ADD_CART_ITEM_URL  = "https://localhost:5001/Api/ShoppingCart/Item/Add",
    UPDATE_CART_ITEM_URL  = "https://localhost:5001/Api/ShoppingCart/Item/Update",
    DELETE_ITEM_FROM_CART_URL  = "https://localhost:5001/Api/ShoppingCart/Item/",
    DELETE_ALL_FROM_CART_URL  = "https://localhost:5001/Api/ShoppingCart/All/",
    DELETE__CART_URL  = "https://localhost:5001/Api/ShoppingCart/",

    GET_USER_BY_ID_URL  = "https://localhost:5001/Api/Users",
    ADD_USER_URL  = "https://localhost:5001/Api/Users/Add",
    UPDATE_USER_URL  = "https://localhost:5001/Api/Users/Update",
    ACTIVATE_USER_URL  = "https://localhost:5001/Api/Users/Activate/",
    DEACTIVATE_USER_URL  = "https://localhost:5001/Api/Users/Deactivate/",
};