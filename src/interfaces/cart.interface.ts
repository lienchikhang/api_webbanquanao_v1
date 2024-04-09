export interface ICartDetail {
    cart_id: number,
    product_id: number,
    amount: number,
    price: number,
}

export interface IGetCartDetail {
    cart_id: number,
    amount: number,
    price: number,
    Products: {
        product_name: string,
        product_id: number,
        Images: {
            img_url: string
        }[]
    }
}