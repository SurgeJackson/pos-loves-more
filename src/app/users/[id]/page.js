'use client';
import UserForm from "@/components/layout/UserForm";
import UserTabs from "@/components/layout/UserTabs";
import {useProfile} from "@/data/UseProfile";
import {redirect, useParams} from "next/navigation";
import {useState} from "react";
import toast from "react-hot-toast";

export default function EditUserPage() {
  const {data, isLoading:loading} = useProfile();
  const {id} = useParams();
  const [redirectToUsers, setRedirectToUsers] = useState(false);
  const {data:user, isLoading, mutate} = useProfile(id);

  async function handleSaveButtonClick(ev, data) {
    ev.preventDefault();
    const promise = new Promise(async (resolve, reject) => {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...data, _id:id}),
      });
      if (res.ok) {
        mutate();
        resolve();
      }
      else {
        reject();
      }
    });

    await toast.promise(promise, {
      loading: 'Сохранение пользователя...',
      success: 'Пользователь сохранен',
      error: 'Ошибка',
    });

    setRedirectToUsers(true);
  }

  if (loading || isLoading) {
    return 'Loading user profile...';
  }

  if (!data?.admin) {
    return 'Not an admin';
  }

  if (redirectToUsers) {
    return redirect('/users');
  }

  return (
    <section className="flex flex-col gap-4 py-2">
      <UserTabs isAdmin={true}/>
      <div className="mt-2">
        <UserForm user={user} onSave={handleSaveButtonClick} isAdmin={data.admin}/>
      </div>
    </section>
  );
}