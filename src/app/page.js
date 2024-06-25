'use client';
import Menu from "@/components/layout/Menu";
import Footer from "@/components/layout/Footer";
import {useSession} from "next-auth/react";
import {redirect} from 'next/navigation';

export default function Home() {
  const session = useSession();
  const status = session?.status;

  if (status === 'unauthenticated') {
    return redirect('/login');
  }

  return (
    <>
      <Menu />
      <Footer />
    </>
  )
}
