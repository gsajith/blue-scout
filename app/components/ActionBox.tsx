import { useRouter } from 'next/navigation';
import { MouseEventHandler } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { FaLock } from 'react-icons/fa';

type ActionBoxProps = {
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  authRequired?: boolean;
};

const ActionBox = ({
  children,
  className,
  authRequired = true,
  onClick,
  ...rest
}: React.PropsWithChildren<ActionBoxProps>) => {
  const { loginResponseData } = useAuth();
  const router = useRouter();
  const needsToAuth = authRequired && !loginResponseData;
  return (
    <button
      onClick={needsToAuth ? () => router.push('/login') : onClick}
      {...rest}
      className={
        'bg-[#262941] hover:bg-[#333654] focus:border-2 cursor-pointer rounded-xl w-72 h-60 m-4 xs:w-full 2xs:w-full sm:w-full p-6 flex flex-col justify-center items-center border-slate-600 border relative' +
        ' ' +
        className
      }
    >
      {needsToAuth ? (
        <div className="w-full h-full flex absolute justify-center items-center">
          <div className="absolute bg-slate-900 opacity-80 w-full h-full rounded-xl flex p-8 justify-center items-end pb-10">
            <FaLock className="mr-2 mb-1" /> Login required
          </div>
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default ActionBox;
