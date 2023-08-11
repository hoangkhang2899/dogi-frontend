import { TProduct } from "types/product";
import currencyFormatter from "utils/currency-formatter";

import style from "./index.module.css";

type ProductProps = {
  item: TProduct;
  select?: (item: TProduct) => void;
};

export const Product = ({ item, select }: ProductProps) => {
  const handleClick = () => {
    if (select) {
      select(item);
    }
  };
  return (
    <div
      role="button"
      className="card text-center py-3 h-100"
      onClick={handleClick}
    >
      <div
        className="card-body"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div className={style.name}>{item.name.toLocaleUpperCase()}</div>
      </div>
    </div>
  );
};
