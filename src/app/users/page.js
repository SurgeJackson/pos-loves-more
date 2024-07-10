'use client';
import {useUsers} from "@/data/UseUsers";
import UserTabs from "@/components/layout/UserTabs";
import Link from "next/link";
import DeleteButton from "@/components/ui/DeleteButton";
import Edit from "@/components/icons/Edit";
import toast from "react-hot-toast";

export default function UsersPage() {
  const {data, isLoading, mutate} = useUsers();

  if (isLoading) {
    return 'Загрузка списка пользователей...';
  }

  async function handleDeleteClick(_id) {
    const promise = new Promise(async (resolve, reject) => {
      const response = await fetch('/api/users?_id=' + _id, {
        method: 'DELETE',
      });
      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });

    await toast.promise(promise, {
      loading: 'Удаление...',
      success: 'Удалена',
      error: 'Ошибка',
    });

    mutate();
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
            <div className="flex gap-1">
              <Link className="button text-sm" href={'/users/'+user._id}>
                <Edit/>
              </Link>
              <DeleteButton
                  label="Удалить"
                  onDelete={() => handleDeleteClick(user._id)} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}