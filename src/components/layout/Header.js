'use client';
import {useContext} from "react";
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import {CartContext} from "@/components/AppContext";
import Orders from "@/components/icons/Orders";
import Profile from "@/components/icons/Profile";
import Logout from "@/components/icons/Logout";

function AuthLinks({status, userName, pos}) {
  if (status === 'authenticated') {
    return (
      <>
        <Link href={'/profile'} className="flex flex-row gap-1 items-center whitespace-nowrap text-xs font-light">
          <Profile /> 
          <div className="flex flex-col items-center">
            <span>{userName}</span>
            <span>{pos.name}</span>
          </div>
        </Link>
        <Link href={'/orders'} className="whitespace-nowrap">
          <Orders />
        </Link>
        <button
          onClick={() => signOut({redirect: true, callbackUrl: "/"})}
          className="bg-primary rounded-full text-white px-8">
          <Logout className="w-6 h-6"/>
        </button>
      </>
    );
  }
}

export default function Header() {
  const session = useSession();
  const status = session?.status;
  const userData = session.data?.user;
  let userName = userData?.name || userData?.email;
  const {pos} = useContext(CartContext);
  if (userName && userName.includes(' ')) {
    userName = userName.split(' ')[0];
  }
  return (
    <header className="bg-white">
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-2 text-gray-500 font-semibold py-2">
          <Link className="text-black border-b-8 border-[#fff089] font-semibold text-lg" href={'/'}>
          LOVES MORE
          </Link>
        </nav>
        <nav className="flex items-center gap-4 text-gray-500 font-semibold">
          <AuthLinks status={status} userName={userName} pos={pos}/>
        </nav>
      </div>
    </header>
  );
}