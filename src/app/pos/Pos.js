import DeleteButton from "@/components/ui/DeleteButton";
import Edit from "@/components/icons/Edit";

export default function Pos({poses, handleEditClick, handleDeleteClick}) {
  return (
      <div className="">
        <h2 className="py-4 text-sm text-gray-500">Список POS</h2>
        {poses?.length > 0 && poses.map(c => (
          <div
            key={c._id}
            className="bg-gray-100 rounded-xl p-2 px-4 flex gap-1 mb-1 items-center">
            <div className="grow">
              {c.name}
            </div>
            <div className="flex gap-1">
              <button type="button"
                      onClick={() => handleEditClick(c)}>
                <Edit/>
              </button>
              <DeleteButton
                label="Удалить"
                onDelete={() => handleDeleteClick(c._id)} />
            </div>
          </div>
        ))}
      </div>
  );
}