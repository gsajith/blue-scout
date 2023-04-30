import { AuthProvider } from './auth/AuthProvider';
import HomePage from './home/page';

export default function Home() {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  );
}
