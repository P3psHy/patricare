import { Page } from '../page';

interface TenantsPageProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function TenantsPage({ onNavigate, onLogout }: TenantsPageProps) {
    return (
        <div>
            <h1>Tenants</h1>
        </div>
    );
}