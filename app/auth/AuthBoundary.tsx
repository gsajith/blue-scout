import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

const AuthBoundary = (props: React.PropsWithChildren) => {
  const { loginResponseData } = useAuth();
  const router = useRouter();

  if (!loginResponseData) {
    router.push('/login');
    return <></>;
  }
  return <>{props.children}</>;
};

export default AuthBoundary;
