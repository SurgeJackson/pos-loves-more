'use client';
import {CartContext} from "@/components/AppContext";
import Orders from "@/components/icons/Orders";
import Profile from "@/components/icons/Profile";
import Logout from "@/components/icons/Logout";
import Login from "@/components/icons/Login";

import ShoppingCart from "@/components/icons/ShoppingCart";
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import {useContext, useState} from "react";

function AuthLinks({status, userName, pos}) {
  if (status === 'authenticated') {
    return (
      <>
        <Link href={'/profile'} className="flex flex-row gap-1 items-center whitespace-nowrap text-xs font-light">
          <Profile /> 
          <div className="flex flex-col items-center">
            <span>{userName}</span>
            <span>{pos}</span>
          </div>
        </Link>
        <Link href={'/orders'} className="whitespace-nowrap">
          <Orders />
        </Link>
        <button
          onClick={() => signOut({redirect: true, callbackUrl: "/"})}
          className="bg-primary rounded-full text-white px-8 py-2">
          <Logout />
        </button>
      </>
    );
  }
  if (status === 'unauthenticated') {
    return (
      <>
        <Link href={'/login'} className="bg-primary rounded-full text-white px-8 py-2">
        <Login /></Link>
        {/* <Link href={'/register'} className="bg-primary rounded-full text-white px-8 py-2">
          Register
        </Link> */}
      </>
    );
  }
}

export default function Header() {
  const session = useSession();
  const status = session?.status;
  const userData = session.data?.user;
  let userName = userData?.name || userData?.email;
  const {cartProducts, pos} = useContext(CartContext);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  if (userName && userName.includes(' ')) {
    userName = userName.split(' ')[0];
  }
  return (
    <header className="bg-white">
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-2 text-gray-500 font-semibold">
          <Link className="text-black border-b-8 border-[#fff089] font-semibold text-lg" href={'/'}>
          LOVES MORE
          </Link>
        </nav>
        <nav className="flex items-center gap-4 text-gray-500 font-semibold">
          <AuthLinks status={status} userName={userName} pos={pos.name}/>
          {/* <Link href={'/cart'} className="relative">
            <ShoppingCart />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
            {cartProducts.length}
          </span>
            )}
          </Link> */}
        </nav>
      </div>
    </header>
  );
}