export type TOrder = {
  _id: string;
  orderProduct: [
    {
      product: string;
      topping: number[];
      attribute: number;
      amount: number;
      price: number;
      group: string;
    }
  ];
  totalPrice: number;
  isGrab: boolean;
  createdBy: string;
  createdDate: string;
};
