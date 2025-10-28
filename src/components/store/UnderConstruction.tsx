import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';

interface UnderConstructionProps {
  pageName: string;
  description: string;
}

/**
 * 実装予定ページの共通UI
 */
export default function UnderConstruction({
  pageName,
  description,
}: UnderConstructionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{pageName}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <div className="p-6 pt-0">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex items-center">
            <div className="text-yellow-400 mr-3">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                🚧 実装予定
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                {pageName}機能は現在開発中です。しばらくお待ちください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
