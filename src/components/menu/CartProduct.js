import {cartProductPrice} from "@/components/AppContext";
import Trash from "@/components/icons/Trash";

export default function CartProduct({index, product, onRemove}) {

  return (
    <div className="flex items-center gap-2 border-b py-2">
      <div className="grow">
        <h3 className="font-semibold">
          {product.name}
        </h3>
        <div key={index} className="text-xs font-extralight">
          {product.category.name}
        </div>
        {product.size && (
          <div className="text-sm">
            Size: <span>{product.size.name}</span>
          </div>
        )}
        {product.extras?.length > 0 && (
          <div className="text-sm text-gray-500">
            {product.extras.map(extra => (
              <div key={extra.name}>{extra.name} ${extra.price}</div>
            ))}
          </div>
        )}
      </div>
      <div className="">
        {cartProductPrice(product).toLocaleString()}&#8381;
      </div>
      {!!onRemove && (
        <div className="ml-2">
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-2">
            <Trash />
          </button>
        </div>
      )}
    </div>
  );
}