'use client';
import Menu from "@/components/layout/Menu";
import Footer from "@/components/layout/Footer";
import {useSession} from "next-auth/react";
import {useProfile} from "@/components/UseProfile";

export default function Home() {
  const session = useSession();
  const status = session?.status;
  const {data:loggedInUserData} = useProfile();

  if (status === 'authenticated') {
  return (
    <>
    <Menu isAdmin={loggedInUserData.admin}/>
    <Footer />
    </>
  )
  } else 
  {
    return (
      <div className="flex h-96 w-96 text-center items-center m-auto text-lg font-semibold">
        Оформление заказов только для сотрудников компании. Пожалуйста, войдите в систему.
      </div>
    )
  }
}
