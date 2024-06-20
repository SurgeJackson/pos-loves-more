'use client';
import DeleteButton from "@/components/DeleteButton";
import UserTabs from "@/components/layout/UserTabs";
import Link from "next/link";
import Right from "@/components/icons/Right";
import {useEffect, useState} from "react";
import {useProfile} from "@/components/UseProfile";
import toast from "react-hot-toast";

export default function PurchasesPage() {
  const [posName, setPosName] = useState('');
  const [purchases, setPurchases] = useState([]);
  const {loading:profileLoading, data:profileData} = useProfile();

  useEffect(() => {
    fetchPurchases();
  }, []);

  function fetchPurchases() {
    fetch('/api/purchases').then(res => {
      res.json().then(purchases => {
        setPurchases(purchases);
      });
    });
  }

  async function handleDeleteClick(_id) {
    const promise = new Promise(async (resolve, reject) => {
      const response = await fetch('/api/purchases?_id='+_id, {
        method: 'DELETE',
      });
      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });

    await toast.promise(promise, {
      loading: 'Deleting...',
      success: 'Deleted',
      error: 'Error',
    });

    fetchPurchases();
  }

  if (profileLoading) {
    return 'Loading user info...';
  }

  if (!profileData?.admin) {
    return 'Not an admin';
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        <Link
          className="button flex"
          href={'/purchases/new'}>
          <span>Создать новый приход товара</span>
          <Right />
        </Link>
      </div>
      <div>
        <h2 className="mt-8 text-sm text-gray-500">Список приходов товара</h2>
        {purchases?.length > 0 && purchases.map(purchase => (
          <div key={purchase._id} className="bg-gray-100 rounded-xl p-2 px-4 flex gap-1 mb-1 items-center">
            <div className="text-gray-500 text-xs grow">{new Date(Date.parse(purchase.createdAt)).toLocaleString()}</div>
            <div className="grow">
              {purchase.pos.name}
            </div>
            <div className="grow">
              {purchase.description}
            </div>
            <div className="flex gap-1">
              <Link
                className="button flex"
                href={'/purchases/edit/'+purchase._id}>
                  <span>Редактировать</span>
              </Link>
              <DeleteButton
                label="Удалить"
                onDelete={() => handleDeleteClick(purchase._id)} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}