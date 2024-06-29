import Link from "next/link";
import {usePathname} from "next/navigation";

export default function UserTabs({isAdmin}) {
  const path = usePathname();
  return (
    <div className="grid grid-cols-5 gap-1 pb-1 tabs text-center text-xs md:text-sm bg-white break-all">
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
        </>
      )}
    </div>
  );
}