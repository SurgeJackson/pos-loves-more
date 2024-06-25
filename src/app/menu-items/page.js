'use client';
import Link from "next/link";
import Right from "@/components/icons/Right";
import UserTabs from "@/components/layout/UserTabs";
import {useProfile} from "@/data/UseProfile";
import {useMenuItems} from "@/data/UseMenuItems";

export default function MenuItemsPage() {
  const {data} = useProfile();
  const {data:menuItems, isLoading:profileLoading} = useMenuItems();

  if (profileLoading) {
    return 'Загрузка списка товаров...';
  }

  if (!data?.admin) {
    return 'Not an admin.';
  }

  return (
    <section className="flex flex-col gap-4 py-2">
      <UserTabs isAdmin={true} />
      <div className="mt-2">
        <Link
          className="button flex"
          href={'/menu-items/new'}>
          <span>Создать новый товар</span>
          <Right />
        </Link>
      </div>
      <div>
        <h2 className="text-sm text-gray-500 mt-8">Редактировать товары:</h2>
        <div className="grid grid-cols-3 gap-2">
          {menuItems?.length > 0 && menuItems.map(item => (
            <Link
              key={item._id}
              href={'/menu-items/edit/'+item._id}
              className="bg-gray-200 rounded-lg p-4"
            >
              <div className="text-center">
                {item.name}
              </div>
              <div className="text-xs text-center font-extralight">{item.category?.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}