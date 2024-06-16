import { cn } from "@/lib/utils";

export default function PosSelector({pos, poses, onClick}) {
  return (
    <div className="flex flex-col gap-2 py-2">
        {poses?.length > 0 && poses.map(c => (
            <button className={cn((pos._id == c._id) ? "bg-primary text-white" : "")} key={c._id} onClick={(ev) => {onClick(c)}}>{c.name}</button>
        ))}
    </div>
  );
}