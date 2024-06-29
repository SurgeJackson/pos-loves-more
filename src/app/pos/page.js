'use client';
import UserTabs from "@/components/layout/UserTabs";
import Pos from "./Pos";
import {useState} from "react";
import {usePoses} from "@/data/UsePoses";
import toast from "react-hot-toast";

export default function PosPage() {
  const [posName, setPosName] = useState('');
  const [editedPos, setEditedPos] = useState(null);
  const {data:poses, isLoading:profileLoading, mutate} = usePoses();

  async function handlePosSubmit(ev) {
    ev.preventDefault();
    const creationPromise = new Promise(async (resolve, reject) => {
      const data = {name:posName};
      if (editedPos) {
        data._id = editedPos._id;
      }
      const response = await fetch('/api/pos', {
        method: editedPos ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setPosName('');
      setEditedPos(null);
      if (response.ok)
        resolve();
      else
        reject();
    });
    await toast.promise(creationPromise, {
      loading: editedPos
                 ? 'Изменение POS...'
                 : 'Создание новой POS...',
      success: editedPos ? 'POS изменена' : 'POS создана',
      error: 'Error, sorry...',
    });

    mutate();
  }

  async function handleDeleteClick(_id) {
    const promise = new Promise(async (resolve, reject) => {
      const response = await fetch('/api/pos?_id='+_id, {
        method: 'DELETE',
      });
      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });

    await toast.promise(promise, {
      loading: 'Удаление...',
      success: 'Удалено',
      error: 'Ошибка',
    });

    mutate();
  }

  function handleEditClick(c) {
    setEditedPos(c);
    setPosName(c.name);
  }

  // if (profileLoading) {
  //   return 'Загрузка списка POS...';
  // }

  return (
    <section className="flex flex-col gap-4 py-2">
      <UserTabs isAdmin={true} />
      <form className="mt-2" onSubmit={handlePosSubmit}>
        <div className="flex gap-2 items-end">
          <div className="grow">
            <label>
              {setEditedPos ? 'Редактировать POS' : 'Наименование POS'}
              {editedPos && (
                <>: <b>{editedPos.name}</b></>
              )}
            </label>
            <input type="text"
                   value={posName}
                   onChange={ev => setPosName(ev.target.value)}
            />
          </div>
          <div className="pb-2 flex gap-2">
            <button className="border border-primary" type="submit">
              {editedPos ? 'Редактировать' : 'Создать'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditedPos(null);
                setPosName('');
              }}>
              Отменить
            </button>
          </div>
        </div>
      </form>
      <Pos poses={poses} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick}/>
    </section>
  );
}