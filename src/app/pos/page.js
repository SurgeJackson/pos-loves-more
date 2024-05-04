'use client';
import DeleteButton from "@/components/DeleteButton";
import UserTabs from "@/components/layout/UserTabs";
import {useEffect, useState} from "react";
import {useProfile} from "@/components/UseProfile";
import toast from "react-hot-toast";

export default function PosPage() {

  const [posName, setPosName] = useState('');
  const [poses, setPoses] = useState([]);
  const {loading:profileLoading, data:profileData} = useProfile();
  const [editedPos, setEditedPos] = useState(null);

  useEffect(() => {
    fetchPoses();
  }, []);

  function fetchPoses() {
    fetch('/api/pos').then(res => {
      res.json().then(poses => {
        setPoses(poses);
      });
    });
  }

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
      fetchPoses();
      setEditedPos(null);
      if (response.ok)
        resolve();
      else
        reject();
    });
    await toast.promise(creationPromise, {
      loading: editedPos
                 ? 'Updating POS...'
                 : 'Creating your new POS...',
      success: editedPos ? 'POS updated' : 'POS created',
      error: 'Error, sorry...',
    });
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
      loading: 'Deleting...',
      success: 'Deleted',
      error: 'Error',
    });

    fetchPoses();
  }

  if (profileLoading) {
    return 'Loading user info...';
  }

  if (!profileData.admin) {
    return 'Not an admin';
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={true} />
      <form className="mt-8" onSubmit={handlePosSubmit}>
        <div className="flex gap-2 items-end">
          <div className="grow">
            <label>
              {setEditedPos ? 'Update POS' : 'New POS name'}
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
              {editedPos ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditedPos(null);
                setPosName('');
              }}>
              Cancel
            </button>
          </div>
        </div>
      </form>
      <div>
        <h2 className="mt-8 text-sm text-gray-500">Existing POS</h2>
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
                Edit
              </button>
              <DeleteButton
                label="Delete"
                onDelete={() => handleDeleteClick(c._id)} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}