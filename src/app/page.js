'use client';
import Header from "@/components/layout/Header";
import Hero from "@/components/layout/Hero";
import HomeMenu from "@/components/layout/HomeMenu";
import SectionHeaders from "@/components/layout/SectionHeaders";
import Menu from "@/components/layout/Menu";
import {useContext, useState} from "react";
import {useSession} from "next-auth/react";

export default function Home() {
  const session = useSession();
  const status = session?.status;
  const userData = session.data?.user;
  let userName = userData?.name || userData?.email;
  if (userName && userName.includes(' ')) {
    userName = userName.split(' ')[0];
  }

  if (status === 'authenticated') {
  return (
    <Menu/>
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
