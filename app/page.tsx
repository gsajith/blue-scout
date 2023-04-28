import { AuthProvider } from './context/AuthProvider';
import LoginOrHome from './components/LoginOrHome';

export default function Home() {
  return (
    <AuthProvider>
      <LoginOrHome />
    </AuthProvider>
  );
}
