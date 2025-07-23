import css from "./SearchBox.module.css";
import { useState } from "react";

interface SearchBoxProps {
  onSearchChange: (search: string) => void;
}

export default function SearchBox({ onSearchChange }: SearchBoxProps) {
  const [valueInput, setValueInput] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.target.value;
    setValueInput(newSearch);
    onSearchChange(newSearch);
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={handleChange}
      value={valueInput}
    />
  );
}
