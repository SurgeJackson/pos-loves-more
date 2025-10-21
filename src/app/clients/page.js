'use client';
import Link from "next/link";
import UserTabs from "@/components/layout/UserTabs";
import {useClients} from "@/data/UseClients";
import toast from "react-hot-toast";

export default function MenuItemsPage() {
  const {data:clients, isLoading:profileLoading} = useClients();

  async function proceedToCheckout(ev) {
    ev.preventDefault();
      const promise = new Promise((resolve, reject) => {
        fetch('/api/sendMessage', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            clients: clients
          }),
        }).then(async (response) => {
          if (response.ok) {
            resolve();
          } else {
            reject();
          }
        });
      });
  
      await toast.promise(promise, {
        loading: 'Sending message...',
        success: 'Message successfully sent!',
        error: 'Something went wrong... Please try again later',
      })
  }

  return (
    <section className="flex flex-col gap-4 py-2">
      <UserTabs isAdmin={true} />
      <div onClick={proceedToCheckout} className={"cursor-pointer text-center rounded-lg max-w-auto p-4 text-sm bg-primary text-white"}>
        {"Send Message"}
      </div>
      <div>
        <h2 className="text-sm text-gray-500 mt-8">Клиенты</h2>
        <div className="grid grid-cols-5 gap-2">
          {clients?.length > 0 && clients.map(item => (
            <div
              key={item._id}
              className="bg-gray-200 rounded-lg p-4"
            >
              <div className="text-xs text-center font-extralight">
                {item.c.from.id}
              </div>
              <div className="text-center">
                {item.c.from.first_name}
              </div>
              <div className="text-center">
                {item.c.from.last_name}
              </div>
              <div className="text-xs text-center font-extralight">
                {item.c.from.username}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}