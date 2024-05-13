'use client';
import DeleteButton from "@/components/DeleteButton";
import Left from "@/components/icons/Left";
import PurchaseForm from "@/components/layout/PurchaseForm";
import UserTabs from "@/components/layout/UserTabs";
import {useProfile} from "@/components/UseProfile";
import Link from "next/link";
import {redirect, useParams} from "next/navigation";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";

export default function EditMenuItemPage() {

  const {id} = useParams();

  const [purchase, setPurchase] = useState(null);
  const [redirectToItems, setRedirectToItems] = useState(false);
  const {loading, data} = useProfile();

  useEffect(() => {
    fetch('/api/purchases?_id='+id).then(res => {
      res.json().then(purchase => setPurchase(purchase))
    });
  }, []);

  async function handleFormSubmit(ev, data) {
    ev.preventDefault();
    data = {...data, _id:id};
    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch('/api/purchases', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok)
        resolve();
      else
        reject();
    });

    await toast.promise(savingPromise, {
      loading: 'Сохранение прихода товаров',
      success: 'Сохранено',
      error: 'Ошибка',
    });

    setRedirectToItems(true);
  }

  async function handleDeleteClick() {
    const promise = new Promise(async (resolve, reject) => {
      const res = await fetch('/api/purchases?_id='+id, {
        method: 'DELETE',
      });
      if (res.ok)
        resolve();
      else
        reject();
    });

    await toast.promise(promise, {
      loading: 'Deleting...',
      success: 'Deleted',
      error: 'Error',
    });

    setRedirectToItems(true);
  }

  if (redirectToItems) {
    return redirect('/purchases');
  }

  if (loading) {
    return 'Loading user info...';
  }

  if (!data.admin) {
    return 'Not an admin.';
  }

  return (
    <section className="mt-8">
      <UserTabs isAdmin={true} />
      <div className="max-w-2xl mx-auto mt-8">
        <Link href={'/purchases'} className="button">
          <Left />
          <span>Показать список приходов товара</span>
        </Link>
      </div>
      <PurchaseForm purchase={purchase} onSubmit={handleFormSubmit} />
      <div className="max-w-md mx-auto mt-2">
          <DeleteButton
            label="Удалить этот приход товаров"
            onDelete={handleDeleteClick}
          />
      </div>
    </section>
  );
}