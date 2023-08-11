import { setOrder } from "appSlice";
import { Product } from "components/Product";
import { useAppDispatch } from "hooks/redux";
import { TProduct } from "types/product";

type ListProductProps = {
  product: TProduct[];
};

export const ListProduct = ({ product }: ListProductProps) => {
  const dispatch = useAppDispatch();
  const sort = product.reduce((p, c) => {
    if (p[c.group]) {
      p[c.group].push(c);
    } else {
      p[c.group] = [c];
    }
    return p;
  }, {} as any);
  return (
    <>
      {Object.keys(sort).map((v) => (
        <div>
          <h3>{v}</h3>
          {sort[v].map((v1: TProduct) => (
            <Product
              item={v1}
              select={(item) => {
                dispatch(setOrder(item));
              }}
            />
          ))}
        </div>
      ))}
    </>
  );
};
