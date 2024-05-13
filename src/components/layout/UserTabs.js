'use client';
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function UserTabs({isAdmin}) {
  const path = usePathname();
  return (
    <div className="flex mx-auto tabs gap-1 justify-center">
      <Link
        className={path === '/profile' ? 'active' : ''}
        href={'/profile'}
      >
        Профиль
      </Link>
      {isAdmin && (
        <>
          <Link
            href={'/categories'}
            className={path === '/categories' ? 'active' : ''}
          >
            Категории
          </Link>
          <Link
            href={'/menu-items'}
            className={path.includes('menu-items') ? 'active' : ''}
          >
            Товары
          </Link>
          <Link
            className={path.includes('/users') ? 'active' : ''}
            href={'/users'}
          >
            Пользователи
          </Link>
          <Link
            className={path.includes('/pos') ? 'active' : ''}
            href={'/pos'}
          >
            POS
          </Link>
          <Link
            className={path.includes('/purchases') ? 'active' : ''}
            href={'/purchases'}
          >
            Приход товара
          </Link>
        </>
      )}
      {/* <Link
        className={path === '/orders' ? 'active' : ''}
        href={'/orders'}
      >
        Заказы
      </Link> */}
    </div>
  );
}