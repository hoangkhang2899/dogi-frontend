export type TProduct = {
  _id: string;
  name: string;
  attribute: {
    size: "M" | "L";
    price: number;
  }[];
  amount: number;
  group: string;
};
