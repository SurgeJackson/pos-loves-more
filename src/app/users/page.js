'use client';
import useSWR from 'swr';
import UserTabs from "@/components/layout/UserTabs";
import Link from "next/link";

export default function UsersPage() {
  const fetcher = (...args) => fetch(...args).then(res => res.json());
  const { data, isLoading } = useSWR('/api/users', fetcher);

  if (isLoading) {
    return 'Загрузка списка пользователей...';
  }

  return (
    <section className="flex flex-col gap-4 py-2">
      <UserTabs isAdmin={true} />
      <div className="mt-2">
        {data?.length > 0 && data.map(user => (
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