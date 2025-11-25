import { Page } from '../page';

interface DashboardProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function Dashboard({ onNavigate, onLogout }: DashboardProps) {
  return (
    <div>
        <h1>Dashboard</h1>
    </div>
  );
}