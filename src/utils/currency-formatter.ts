const format = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const currencyFormatter = (price: number) => {
  return format.format(price);
};

export default currencyFormatter;
