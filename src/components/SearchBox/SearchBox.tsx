import css from "./SearchBox.module.css";
interface SearchBoxProps {
  searchProps: () => void;
  inputValue: string;
}

export default function SearchBox({ searchProps, inputValue }: SearchBoxProps) {

    
    return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={searchProps}
      value={inputValue}
      />

  );
}
