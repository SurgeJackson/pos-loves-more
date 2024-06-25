'use client';
import DeleteButton from "@/components/ui/DeleteButton";
import Left from "@/components/icons/Left";
import MenuItemForm from "@/components/layout/MenuItemForm";
import UserTabs from "@/components/layout/UserTabs";
import {useProfile} from "@/data/UseProfile";
import {useMenuItems} from "@/data/UseMenuItems";
import Link from "next/link";
import {redirect, useParams} from "next/navigation";
import {useState} from "react";
import toast from "react-hot-toast";

export default function EditMenuItemPage() {
  const {id} = useParams();
  const [redirectToItems, setRedirectToItems] = useState(false);
  const {data, isloading:loading} = useProfile();
  const {data:menuItem, isLoading, mutate} = useMenuItems(id);

  async function handleFormSubmit(ev, data) {
    ev.preventDefault();
    data = {...data, _id:id};
    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch('/api/menu-items', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        mutate();
        resolve();
      }
      else {
        reject();
      }
    });

    await toast.promise(savingPromise, {
      loading: 'Сохранение товара',
      success: 'Сохранено',
      error: 'Ошибка',
    });

    setRedirectToItems(true);
  }

  async function handleDeleteClick() {
    const promise = new Promise(async (resolve, reject) => {
      const res = await fetch('/api/menu-items?_id='+id, {
        method: 'DELETE',
      });
      if (res.ok)
        resolve();
      else
        reject();
    });

    await toast.promise(promise, {
      loading: 'Удаление...',
      success: 'Удалено',
      error: 'Ошибка',
    });

    setRedirectToItems(true);
  }

  if (redirectToItems) {
    return redirect('/menu-items');
  }

  if (loading || isLoading) {
    return 'Loading ...';
  }

  if (!data?.admin) {
    return 'Not an admin.';
  }

  return (
    <section className="flex flex-col gap-4 py-2">
      <UserTabs isAdmin={true} />
      <div className="mt-2">
        <Link href={'/menu-items'} className="button">
          <Left />
          <span>Показать список товаров</span>
        </Link>
      </div>
      <MenuItemForm menuItem={menuItem} onSubmit={handleFormSubmit} />
      <DeleteButton label="Удалить этот товар" onDelete={handleDeleteClick}/>
    </section>
  );
}