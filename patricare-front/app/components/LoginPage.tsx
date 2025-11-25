import { Page } from '../page';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin}: LoginPageProps) {
  return (
    <div>
        <h1>Login</h1>
    </div>
  );
}