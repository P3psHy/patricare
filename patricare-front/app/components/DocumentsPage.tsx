import { Page } from '../page';

interface DocumentsPageProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function DocumentsPage({ onNavigate, onLogout }: DocumentsPageProps) {
  return (
    <div>
        <h1>Documents</h1>
    </div>
  );
}