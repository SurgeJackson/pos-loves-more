import {useState} from "react";
import Switch from "@/components/menu/Switch";

export default function UserForm({user, onSave, isAdmin}) {
  const [userName, setUserName] = useState(user?.name || '');
  const [admin, setAdmin] = useState(user?.admin || false);

  return (
    <div className="md:flex gap-4">
      <form className="grow" onSubmit={ev => onSave(ev, {name:userName,admin})}>
        <label>Ф.И.О.</label>
        <input type="text" placeholder="Ф.И.О." value={userName} onChange={ev => setUserName(ev.target.value)}/>
        <label>Email</label>
        <input type="email" disabled={true} value={user?.email} placeholder={'email'}/>
        {isAdmin && (
          <Switch className="flex flex-row justify-start py-4" label={"Админ"} id="PayCash" checked={admin} onChange={ev => setAdmin(ev.target.checked)}/>
        )}
        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
}