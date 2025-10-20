export default function MenuItemTile({onAddToCart, item}) {
  return (
    <div className="flex flex-col items-center bg-gray-200 p-2 rounded-lg text-center
      group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all cursor-pointer relative" onClick={onAddToCart}>
      <h4 className="font-semibold text-base pt-4">{item.name}</h4>
      <h4 className="font-semibold text-base my-2 text-primary">{item.basePrice.toLocaleString("ru-RU")}&#8381;</h4>
    </div>
  );
}