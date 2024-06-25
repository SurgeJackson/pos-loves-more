'use client';
import {useState} from "react";
import DeleteButton from "@/components/ui/DeleteButton";
import UserTabs from "@/components/layout/UserTabs";
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

  if (profileLoading) {
    return 'Загрузка списка POS...';
  }

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
      <div>
        <h2 className="mt-8 text-sm text-gray-500">Список POS</h2>
        {poses?.length > 0 && poses.map(c => (
          <div
            key={c._id}
            className="bg-gray-100 rounded-xl p-2 px-4 flex gap-1 mb-1 items-center">
            <div className="grow">
              {c.name}
            </div>
            <div className="flex gap-1">
              <button type="button"
                      onClick={() => {
                        setEditedPos(c);
                        setPosName(c.name);
                      }}
              >
                Редактировать
              </button>
              <DeleteButton
                label="Удалить"
                onDelete={() => handleDeleteClick(c._id)} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}