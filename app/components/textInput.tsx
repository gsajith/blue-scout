import { ChangeEventHandler, HTMLInputTypeAttribute } from 'react';

interface TextInputProps extends React.ComponentProps<'input'> {
  type: HTMLInputTypeAttribute;
  placeholder: string;
  value?: string | number | readonly string[] | undefined;
  className?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}
const TextInput = ({
  type,
  placeholder,
  value,
  onChange,
  className,
  ...rest
}: TextInputProps) => {
  return (
    <input
      {...rest}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={
        'border bg-[#2F3151] border-slate-700 p-2 rounded mb-4 focus:outline-black ' +
        className
      }
    />
  );
};

export default TextInput;
