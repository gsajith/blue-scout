import { AuthProvider } from './auth/AuthProvider';
import LoginOrHome from './components/LoginOrHome';

export default function Home() {
  return (
    <AuthProvider>
      <LoginOrHome />
    </AuthProvider>
  );
}
