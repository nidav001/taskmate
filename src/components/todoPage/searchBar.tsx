type SearchBarProps = {
  setSearch: (search: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ setSearch }) => {
  return (
    <div className="flex flex-col items-center">
      <input
        type="text"
        className="w-50 rounded-xl"
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
