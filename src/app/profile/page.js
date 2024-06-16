'use client';
import UserForm from "@/components/layout/UserForm";
import UserTabs from "@/components/layout/UserTabs";
import PosSelector from "@/components/layout/PosSelector";
import {useSession} from "next-auth/react";
import {redirect} from 'next/navigation';

import {useEffect, useState, useContext} from "react";
import toast from "react-hot-toast";
import {CartContext} from "@/components/AppContext";

export default function ProfilePage() {
  const session = useSession();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);
  const {status} = session;
  const [poses, setPoses] = useState([]);
  const [redirectToMain, setRedirectToMain] = useState(false);
  const {pos, setUserPos, setPos} = useContext(CartContext);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/profile').then(response => {
        response.json().then(data => {
          setUser(data);
          setIsAdmin(data.admin);
          setProfileFetched(true);
        })
      });
    }
  }, [session, status]);

  useEffect(() => {
    fetchPoses();
  }, []);

  function fetchPoses() {
    fetch('/api/pos').then(res => {
      res.json().then(poses => {
        setPoses(poses);
      });
    });
  }

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

  if (status === 'loading' || !profileFetched) {
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
      <UserTabs isAdmin={isAdmin} />
      <div className="mt-2">
        <UserForm user={user} onSave={handleProfileInfoUpdate} />
      </div>
      {isAdmin && 
      <div className="mt-2">
        <h2 className="text-sm text-gray-500 mt-2">Переключить POS</h2>
        <PosSelector pos={pos} poses={poses} onClick={handlePosSelectorClick}/>
      </div>}
    </section>
  );
}