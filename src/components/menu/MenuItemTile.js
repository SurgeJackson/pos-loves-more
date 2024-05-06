import AddToCartButton from "@/components/menu/AddToCartButton";

export default function MenuItemTile({onAddToCart, ...item}) {
  const {image, description, name, basePrice,
    sizes, extraIngredientPrices, key, category
  } = item;
  const hasSizesOrExtras = sizes?.length > 0 || extraIngredientPrices?.length > 0;
  
  return (
    <div key={key} className="bg-gray-200 p-2 rounded-lg text-center
      group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all cursor-pointer" onClick={onAddToCart}>
      <h4 className="font-semibold text-lg my-2">{name}</h4>
      <h4 className="font-semibold text-lg my-2 text-primary">{basePrice.toLocaleString()}&#8381;</h4>
      {/* <AddToCartButton
        image={image}
        hasSizesOrExtras={hasSizesOrExtras}
        onClick={onAddToCart}
        basePrice={basePrice}
      /> */}
    </div>
  );
}