import { AuthProvider } from '@/contexts/AuthContext';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
