import useSearchStore from "../../hooks/searchStore";

const SearchBar: React.FC = () => {
  const { search, setSearch } = useSearchStore();
  return (
    <div className="flex flex-col items-center">
      <form>
        <input
          type="text"
          className="w-50 rounded-xl"
          placeholder="Search..."
          defaultValue={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
    </div>
  );
};

export default SearchBar;
