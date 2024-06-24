import {useState} from "react";
import {useCategories} from "@/components/UseCategories";

export default function MenuItemForm({onSubmit,menuItem}) {
  const [name, setName] = useState(menuItem?.name || '');
  const [description, setDescription] = useState(menuItem?.description || '');
  const [basePrice, setBasePrice] = useState(menuItem?.basePrice || '');
  const [category, setCategory] = useState(menuItem?.category || '');
  const {data:categories, isLoading:profileLoading} = useCategories();
  
  if (profileLoading) {
    return 'Загрузка категорий...';
  }

  return (
    <form onSubmit={ev =>
        onSubmit(ev, {
          name,description,basePrice,category,
        })} className="mt-2">
      <div className="grid items-start gap-4">
        <div className="grow">
          <label>Наименование товара</label>
          <input
            type="text"
            value={name}
            onChange={ev => setName(ev.target.value)}
          />
          <label>Описание</label>
          <input
            type="text"
            value={description}
            onChange={ev => setDescription(ev.target.value)}
          />
          <label>Категория</label>
          <select value={category} onChange={ev => setCategory(ev.target.value)}>
            {categories?.length > 0 && categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <label>Цена</label>
          <input
            type="text"
            value={basePrice}
            onChange={ev => setBasePrice(ev.target.value)}
          />
          <button type="submit">Сохранить</button>
        </div>
      </div>
    </form>
  );
}