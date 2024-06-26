'use client';
import UserForm from "@/components/layout/UserForm";
import UserTabs from "@/components/layout/UserTabs";
import PosSelector from "@/components/ui/PosSelector";
import {useSession} from "next-auth/react";
import {redirect} from 'next/navigation';
import {useProfile} from "@/data/UseProfile";
import {usePoses} from "@/data/UsePoses";

import {useState, useContext} from "react";
import toast from "react-hot-toast";
import {CartContext} from "@/components/AppContext";

export default function ProfilePage() {
  const session = useSession();
  const {status} = session;
  const [redirectToMain, setRedirectToMain] = useState(false);
  const {pos, setUserPos, setPos} = useContext(CartContext);
  const {data:user, isLoading:profileFetched} = useProfile();
  const {data:poses} = usePoses();

  async function handleProfileInfoUpdate(ev, data) {
    ev.preventDefault();

    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      });
      if (response.ok)
        resolve()
      else
        reject();
    });

    await toast.promise(savingPromise, {
      loading: 'Сохранение...',
      success: 'Профиль пользователя сохранен!',
      error: 'Ошибка',
    });

  }

  if (status === 'loading' || profileFetched) {
     return 'Loading...';
  }

  if (status === 'unauthenticated') {
    return redirect('/login');
  }

  function handlePosSelectorClick(newPos) {
    setUserPos(newPos);
    setPos(newPos);
    setRedirectToMain(true);
  }

  if (redirectToMain) {
    return redirect('/');
  }

  return (
    <section className="flex flex-col gap-4 py-2">
      <UserTabs isAdmin={user?.admin} />
      <div className="mt-2">
        <UserForm user={user} onSave={handleProfileInfoUpdate} isAdmin={user?.admin}/>
      </div>
      {user?.admin && 
      <PosSelector pos={pos} poses={poses} onClick={handlePosSelectorClick}/>}
    </section>
  );
}