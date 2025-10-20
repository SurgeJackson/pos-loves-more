import {useState, useContext} from "react";
import {CartContext} from "@/components/AppContext";
import MenuItemTile from "@/components/layout/MenuItemTile";
import MenuHeader from "@/components/layout/MenuHeader";
import QtyButton from "@/components/ui/QtyButton";
import toast from "react-hot-toast";
import {useProfile} from "@/data/UseProfile";
import {useCategories} from "@/data/UseCategories";
import {useMenuItems} from "@/data/UseMenuItems";
import {useInventory} from "@/data/UseInventory";
import {useInvRequests} from "@/data/UseInvRequests";

export default function Menu() {
  const {pos, addToCart} = useContext(CartContext);
  const {data:user} = useProfile();
  const {data:categories} = useCategories();
  const {data:menuItems} = useMenuItems();
  const {data:inventory, mutate} = useInventory(pos);
  const {data:invRequests, mutate:mutateInvRequest} = useInvRequests(pos);

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

  async function createInvRequest(item) {
      const creationPromise = new Promise(async (resolve, reject) => {
          const data = {
            pos: pos, 
            product: item,
            isOpen: true, 
          };
          const response = await fetch('/api/invRequest', {
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
        loading: 'Отправка запроса на пересчет остатка...',
        success: 'Запрос на пересчет остатка отправлен',
        error: 'Ошибка при отправке запроса',
      });
      mutateInvRequest();
  }
  
  async function updateInvRequest(item, id) {
    const creationPromise = new Promise(async (resolve, reject) => {
      const data = {
        _id: id,
        pos: pos, 
        product: item,
        isOpen: false, 
      };
      const response = await fetch('/api/invRequest', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok)
        resolve();
      else
        reject();
    }); 

    await toast.promise(creationPromise, {
      loading: 'Отправка запроса на пересчет остатка...',
      success: 'Запрос на пересчет остатка отправлен',
      error: 'Ошибка при отправке запроса',
    });
    mutateInvRequest();
  }

  async function handleRequestButtonClick(item, requested) {
    if (requested?.isOpen) {
      await updateInvRequest(item, requested?._id);
    } else {
      await createInvRequest(item);
    }
  }

  return (
    <section className="flex flex-col gap-4 py-2">
      <MenuHeader categories={categories} handleTabOpen={handleTabOpen} open={open}/>
      {categories?.length > 0 && categories.map((c, index) => (
        <div key={index} className={`grid grid-cols-6 gap-1 ${open === index ? "block" : "hidden"} `}>
          {menuItems?.filter(item => item.category._id === c._id).map(item => (
            <div key={item._id} className="relative">
              <MenuItemTile
                onAddToCart={() => handleAddToCartButtonClick(item)}
                item={item}/>
              <QtyButton
                label = {inventory?.filter(product => product.id === item._id)[0]?.qty}
                onUpdate={handleQtyButtonClick}
                onRequest={handleRequestButtonClick}
                item = {item}
                isAdmin = {user?.admin}
                requested = {invRequests?.filter(p => (p.product._id === item._id))[0]}
                className={"absolute top-0.5 right-0.5 p-0.5 w-6 h-6 flex items-center justify-center rounded-full text-xs"} 
              />
            </div>
         ))}
        </div>
      ))} 
    </section>
  )
};