'use client';
import {signIn} from "next-auth/react";
import Image from "next/image";
import {useEffect, useState, useContext} from "react";
import {CartContext} from "@/components/AppContext";
import toast from "react-hot-toast";
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [poses, setPoses] = useState([]);
  const [uPos, setUPos] = useState('0');
  const {setUserPos} = useContext(CartContext);
  
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errors = {
    Signin: 'Try signing with a different account.',
    OAuthSignin: 'Try signing with a different account.',
    OAuthCallback: 'Try signing with a different account.',
    OAuthCreateAccount: 'Try signing with a different account.',
    EmailCreateAccount: 'Try signing with a different account.',
    Callback: 'Try signing with a different account.',
    OAuthAccountNotLinked:
      'To confirm your identity, sign in with the same account you used originally.',
    EmailSignin: 'Check your email address.',
    CredentialsSignin:
      'Sign in failed. Check the details you provided are correct.',
    default: 'Unable to sign in.',
  };

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setLoginInProgress(true);

    poses.filter(c => c._id === uPos).map((c, index) => (setUserPos(c)));

    await signIn('credentials', {email, password, callbackUrl: "/", redirect: true});

    setLoginInProgress(false);
  }

  useEffect(() => {
    fetch('/api/pos').then(res => {
      res.json().then(poses => {
        setPoses(poses);
      });
    });
  }, []);

  const SignInError = ({ error }) => {
    const errorMessage = error && (errors[error] ?? errors.default);
    return <div className="text-center text-primary font-semibold">{errorMessage}</div>;
  };

  return (
    <section className="mt-8">
      {error && <SignInError error={error} />}
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