'use client';
import Left from "@/components/icons/Left";
import PurchaseForm from "@/components/layout/PurchaseForm";
import UserTabs from "@/components/layout/UserTabs";
import {useProfile} from "@/components/UseProfile";
import Link from "next/link";
import {redirect} from "next/navigation";
import {useState} from "react";
import toast from "react-hot-toast";

export default function NewPurchasePage() {

  const [redirectToItems, setRedirectToItems] = useState(false);
  const {loading, data} = useProfile();

  async function handleFormSubmit(ev, data) {
    ev.preventDefault();
    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch('/api/purchases', {
        method: 'POST',
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

  if (redirectToItems) {
    return redirect('/purchases');
  }

  if (loading) {
    return 'Loading user info...';
  }

  if (!data?.admin) {
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
      <PurchaseForm purchase={null} onSubmit={handleFormSubmit} />
    </section>
  );
}