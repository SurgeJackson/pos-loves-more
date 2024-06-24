import {useState, useContext} from "react";
import {CartContext} from "@/components/AppContext";
import MenuItemTile from "@/components/menu/MenuItemTile";
import MenuHeader from "@/components/menu/MenuHeader";
import QtyButton from "@/components/QtyButton";
import toast from "react-hot-toast";
import {useProfile} from "@/components/UseProfile";
import {useCategories} from "@/components/UseCategories";
import {useMenuItems} from "@/components/UseMenuItems";
import {useInventory} from "@/components/UseInventory";

export default function Menu() {
  const {pos, addToCart} = useContext(CartContext);
  const {data:user} = useProfile();
  const {data:categories} = useCategories();
  const {data:menuItems} = useMenuItems();
  const {data:inventory, mutate} = useInventory(pos);

  const [open, setOpen] = useState(0);
  const handleTabOpen = (tabCategory) => {
    setOpen(tabCategory);
  };

  async function handleAddToCartButtonClick(menuItem) {    
    addToCart(menuItem);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  async function handleQtyButtonClick(item, qty) {   
    const creationPromise = new Promise(async (resolve, reject) => {
      const data = {
        pos: pos, 
        description: "Test", 
        product: item, 
        qty: qty
      };

      const response = await fetch('/api/invTrans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok)
        resolve();
      else
        reject();
    }); 

    await toast.promise(creationPromise, {
      loading: 'Изменение остатка...',
      success: 'Остаток изменен',
      error: 'Ошибка при изменении остатка',
    });
    mutate();
  }

  return (
    <section className="flex flex-col gap-4 py-2">
      <MenuHeader categories={categories} handleTabOpen={handleTabOpen} open={open}/>
      {categories?.length > 0 && categories.map((c, index) => (
        <div key={index} className={`grid grid-cols-5 gap-1 ${open === index ? "block" : "hidden"} `}>
          {menuItems?.filter(item => item.category._id === c._id).map(item => (
            <div key={item._id} className="relative">
              <MenuItemTile
                onAddToCart={() => handleAddToCartButtonClick(item)}
                item={item}/>
              <QtyButton
                label={inventory?.filter(product => product.id === item._id).map(prod => (prod.qty))}
                onUpdate={handleQtyButtonClick}
                item = {item}
                isAdmin = {user?.admin}
                className={"absolute top-0.5 right-0.5 p-0.5 w-6 h-6 flex items-center justify-center rounded-full text-xs"} 
              />
            </div>
         ))}
        </div>
      ))} 
    </section>
  )
};