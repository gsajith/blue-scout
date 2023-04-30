import { useRouter } from 'next/navigation';
import LoginPage from '../login/page';
import { useAuth } from './AuthProvider';

const AuthBoundary = (props: React.PropsWithChildren) => {
  const { authLoading, loginResponseData } = useAuth();
  const router = useRouter();

  if (authLoading) {
    return (
      <div className="flex flex-row items-center justify-center  ">
        <div className="lds-dual-ring mr-2" />
        Loading...
      </div>
    );
  }

  if (!loginResponseData) {
    router.push('/login');
    return <></>;
  }
  return <>{props.children}</>;
};

export default AuthBoundary;
