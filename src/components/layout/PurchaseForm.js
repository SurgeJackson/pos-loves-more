import Plus from "@/components/icons/Plus";
import Trash from "@/components/icons/Trash";
import PurchaseItemProps from "@/components/layout/PurchaseItemProps";
import {useEffect, useState} from "react";

export default function PurchaseForm({onSubmit, purchase}) {
  const [description, setDescription] = useState(purchase?.description || '');
  const [purchaseProducts, setPurchaseProducts] = useState(purchase?.purchaseProducts || []);
  const [pos, setPos] = useState(purchase?.pos || '');
  const [poses, setPoses] = useState([]);

  useEffect(() => {
    fetch('/api/pos').then(res => {
      res.json().then(poses => {
        setPoses(poses);
      });
    });
  }, []);

  return (
    <form onSubmit={ev => onSubmit(ev, {
          description,pos,purchaseProducts,
        })
      } className="mt-8 max-w-2xl mx-auto">
      <div className="grid items-start gap-4">
        <div className="grow">
          <label>POS</label>
          <select value={pos} onChange={ev => setPos(ev.target.value)}>
            {poses?.length > 0 && poses.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <label>Примечание</label>
          <input
            type="text"
            value={description}
            onChange={ev => setDescription(ev.target.value)}
          />
          <PurchaseItemProps name={'Товары'}
                              addLabel={'Добавить товары в приход'}
                              props={purchaseProducts}
                              setProps={setPurchaseProducts} />
          <button type="submit">Сохранить</button>
        </div>
      </div>
    </form>
  );
}