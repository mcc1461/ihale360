export default function Search() {
  return (
    <div className="flex items-center justify-between w-[95%]">
      <p className="text-4xl font-bold">Items</p>
      <input
        type="search"
        placeholder="Search by name"
        className="placeholder:text-center h-[30px] rounded-lg w-[300px] pl-3 border-2 border-black outline-none"
      />
    </div>
  );
}