import { Page } from '../page';

interface PropertiesPageProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function PropertiesPage({ onNavigate, onLogout }: PropertiesPageProps) {
    return (
        <div>
            <h1>Properties</h1>
        </div>
    );
}