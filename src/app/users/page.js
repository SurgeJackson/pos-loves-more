'use client';
import UserTabs from "@/components/layout/UserTabs";
import {useProfile} from "@/components/UseProfile";
import Link from "next/link";
import {useEffect, useState} from "react";

export default function UsersPage() {

  const [users, setUsers] = useState([]);
  const {loading,data} = useProfile();

  useEffect(() => {
    fetch('/api/users').then(response => {
      response.json().then(users => {
        setUsers(users);
      });
    })
  }, []);

  if (loading) {
    return 'Loading user info...';
  }

  if (!data.admin) {
    return 'Not an admin';
  }

  return (
    <section className="flex flex-col gap-4 py-2">
      <UserTabs isAdmin={true} />
      <div className="mt-2">
        {users?.length > 0 && users.map(user => (
          <div key={user._id}
            className="bg-gray-100 rounded-lg mb-2 py-1 px-2 grid grid-cols-[1fr_1fr_2fr] items-center justify-evenly gap-2 break-all">
            <div className="text-gray-900">
                  {!!user.name && (<span>{user.name}</span>)}
                  {!user.name && (<span className="italic">No name</span>)}
            </div>
            <div className="text-gray-500 text-xs">{user.email}</div>
            <Link className="button text-sm" href={'/users/'+user._id}>
              Редактировать
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}