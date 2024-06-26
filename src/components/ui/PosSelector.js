import { cn } from "@/lib/utils";

export default function PosSelector({pos, poses, onClick}) {
  return (
    <div className="mt-2 border p-2">
      <h2 className="text-base text-gray-500 mb-2">Переключить POS</h2>
      <div className="flex flex-col gap-2 py-2">
          {poses?.length > 0 && poses.map(c => (
              <button 
                className={cn((pos._id == c._id) ? "bg-primary text-white" : "", "text-sm")} 
                key={c._id} 
                onClick={(ev) => {onClick(c)}}>
                  {c.name}
              </button>
          ))}
      </div>
    </div>
  );
}