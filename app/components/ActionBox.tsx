import { MouseEventHandler } from 'react';

type ActionBoxProps = {
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
};

const ActionBox = ({
  children,
  className,
  onClick,
  ...rest
}: React.PropsWithChildren<ActionBoxProps>) => {
  return (
    <button
      onClick={onClick}
      {...rest}
      className={
        'bg-[#262941] hover:bg-[#333654] focus:border-1 cursor-pointer rounded-xl w-72 h-60 m-4 xs:w-full 2xs:w-full sm:w-full p-6 flex flex-col justify-center items-center' +
        ' ' +
        className
      }
    >
      {children}
    </button>
  );
};

export default ActionBox;
