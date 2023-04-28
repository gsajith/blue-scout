import { AuthProvider } from './AuthProvider';
import LoginOrHome from './LoginOrHome';

export default function Home() {
  return (
    <AuthProvider>
      <LoginOrHome />
    </AuthProvider>
  );
}
