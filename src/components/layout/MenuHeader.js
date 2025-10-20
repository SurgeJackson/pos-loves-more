export default function MenuHeader({categories, handleTabOpen, open}) {
  return (
    <div className="grid grid-cols-6 gap-2 pb-1 sticky top-0 z-10 bg-white shadow-[0_5px_5px_-5px_rgba(0,0,0,0.1)]">
      {categories?.length > 0 && categories.map((c, index) => (
        <a key={index} onClick={() => handleTabOpen(index)}
          className={`cursor-pointer text-center rounded-lg max-w-auto py-4 text-xs ${
          open === index ? "bg-primary text-white" : "text-body-color hover:bg-primary hover:text-white"}`}>
            {c.name}
        </a>
      ))}
    </div>
  )
};