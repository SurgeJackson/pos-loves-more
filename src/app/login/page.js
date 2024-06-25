'use client';
import {signIn} from "next-auth/react";
import {useState, useContext} from "react";
import {CartContext} from "@/components/AppContext";
import LoginError from "@/components/ui/LoginError";
import { Suspense } from 'react';
import {usePoses} from "@/data/UsePoses";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginInProgress, setLoginInProgress] = useState(false);
  const {data:poses} = usePoses();

  const [uPos, setUPos] = useState('0');
  const {setUserPos} = useContext(CartContext);

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setLoginInProgress(true);

    poses.filter(c => c._id === uPos).map((c, index) => (setUserPos(c)));

    await signIn('credentials', {email, password, callbackUrl: "/", redirect: true});

    setLoginInProgress(false);
  }

  function LoginErrorFallback() {
    return <>placeholder</>
  }

  return (
    <section className="mt-8">
      <Suspense fallback={<LoginErrorFallback />}>
          <LoginError />
      </Suspense>
      <h1 className="text-center text-primary text-4xl mb-4">
        Вход в систему
      </h1>
      <form className="max-w-xs mx-auto" onSubmit={handleFormSubmit}>
        <input type="email" name="email" placeholder="email" value={email}
               disabled={loginInProgress}
               onChange={ev => setEmail(ev.target.value)} />
        <input type="password" name="password" placeholder="password" value={password}
               disabled={loginInProgress}
               onChange={ev => setPassword(ev.target.value)}/>
        <label>POS</label>
        <select value={uPos} onChange={ev => setUPos(ev.target.value)}>
          <option key={1} value={0}></option>
          {poses?.length > 0 && poses.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        
        <button disabled={(loginInProgress || uPos==0)} type="submit">Войти</button>
      </form>
    </section>
  );
}