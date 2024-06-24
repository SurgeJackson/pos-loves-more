import ChevronDown from "@/components/icons/ChevronDown";
import ChevronUp from "@/components/icons/ChevronUp";
import Plus from "@/components/icons/Plus";
import Trash from "@/components/icons/Trash";
import {useState, useEffect} from "react";

export default function PurchaseItemProps({name, addLabel, props, setProps}) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  
  useEffect(() => {
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => {
        setMenuItems(menuItems);
      });
    })
  }, []);

  function addProp() {
    setProps(oldProps => {
      return [...oldProps, {product:'', quantity:0}];
    });
  }

  function editProp(value, index, prop) {
    const newValue = value;
    setProps(prevItems => {
      const newItems = [...prevItems];
      newItems[index][prop] = newValue;
      return newItems;
    });
  }

  function removeProp(indexToRemove) {
    setProps(prev => prev.filter((v,index) => index !== indexToRemove));
  }

  return (
    <div className="bg-gray-200 p-2 rounded-md mb-2">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="inline-flex p-1 border-0 justify-start"
        type="button">
        {isOpen && (
          <ChevronUp />
        )}
        {!isOpen && (
          <ChevronDown />
        )}
        <span>{name}</span>
        <span>({props?.length})</span>
      </button>
      <div className={isOpen ? 'block' : 'hidden'}>
        {props?.length > 0 && props.map((purchaseProduct, index) => (
          <div key={index} className="flex items-end gap-2">
            <div>
              <label>Товар</label>
              <select value={purchaseProduct.product._id} onChange={ev => editProp(
                menuItems.find(c => (c._id == ev.target.value)), index, 'product')}>
                <option key={1} value={0}></option>
                {menuItems?.length > 0 && menuItems.map(c => (
                  <option key={c._id} value={c._id}>{c.name} {c.category.name}</option>
              ))}
              </select>
            </div>
            <div>
              <label>Количество</label>
              <input type="text" placeholder="Количество"
                     value={purchaseProduct.quantity}
                     onChange={ev => editProp(ev.target.value, index, 'quantity')}
              />
            </div>
            <div>
              <button type="button"
                      onClick={() => removeProp(index)}
                      className="bg-white mb-2 px-2">
                <Trash />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addProp}
          className="bg-white items-center">
          <Plus className="w-4 h-4" />
          <span>{addLabel}</span>
        </button>
      </div>
    </div>
  );
}