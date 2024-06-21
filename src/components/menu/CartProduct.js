import {cartProductPrice} from "@/components/AppContext";
import Trash from "@/components/icons/Trash";

export default function CartProduct({index, product}) {

  return (
    <div className="flex items-center gap-2 border-b py-1">
      <div key={index} className="grow">
          {product.name} - {product.category.name}
      </div>
      <div className="">
        {cartProductPrice(product).toLocaleString()}&#8381;
      </div>
    </div>
  );
}