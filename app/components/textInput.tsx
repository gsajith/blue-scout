import { ChangeEventHandler, HTMLInputTypeAttribute } from 'react';

type TextInputProps = {
  type: HTMLInputTypeAttribute;
  placeholder: string;
  value: string | number | readonly string[] | undefined;
  onChange: ChangeEventHandler<HTMLInputElement>;
};
const TextInput = ({ type, placeholder, value, onChange }: TextInputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border bg-[#2F3151] border-slate-700 p-2 rounded mb-4 focus:outline-black"
    />
  );
};

export default TextInput;
