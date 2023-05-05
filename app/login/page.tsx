'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '../auth/AuthProvider';
import Header from '../components/Header';
import LoginBox from '../components/LoginBox';
import SecurityInfo from '../components/SecurityInfo';

const LoginPage = () => {
  const { loginResponseData } = useAuth();
  const router = useRouter();

  if (loginResponseData) {
    router.push('/');
  }

  return (
    <main className="flex flex-col items-center h-screen">
      <Header />
      {!loginResponseData && (
        <div className="flex flex-col items-center justify-center p-2 pb-8">
          <div className="shadow-2xl rounded-3xl bg-[#1D1E35] p-12">
            <LoginBox />
          </div>
          {/* Security policy section */}
          <SecurityInfo />
        </div>
      )}
    </main>
  );
};

export default LoginPage;
