export type Pizza = {
    pizza_id: number;
    name: string;
    description?: string;
    price: number;
};

export type Topping = {
    toppingId: number;
    name: string;
    price: number;
};

export type PizzaTopping = {
    pizzaId: number;
    toppingId: number;
};

export type Village = {
    postalCode: string;
    villageName: string;
};

export type User = {
    user_id: number;
    firstName?: string;
    lastName?: string;
    username: string;
    password: string;
    email: string;
    street: string;
    postal_code: string;
    village_name: string;
    role: 'customer' | 'admin';
};

export type Order = {
    orderId: number;
    userId: number;
    orderDate: Date;
    status?: string;
    totalPrice: number;
    details:[]
};

export type OrderDetail = {
    orderDetailId: number;
    orderId: number;
    pizzaId: number;
    quantity: number;
};

export type SelectedOptions = {
    [key: string]: Option | null;
};
export type Option = {
    name: string;
    price: number;
    pizzaId: number;
};
