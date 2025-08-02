import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function Footer() {
  return (
    <footer className="w-full px-4 py-6 mt-10 border-t border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-3xl mx-auto space-y-4 text-center">
        <Alert
          variant="default"
          className="justify-center dark:bg-gray-800 dark:text-gray-200"
        >
          <AlertTitle>Önemli Uyarı</AlertTitle>
          <AlertDescription>
            Bu sitedeki makale bağlantıları üçüncü taraf kaynaklara
            yönlendirilir. Paprika bu içeriklerden sorumlu değildir.
          </AlertDescription>
        </Alert>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Made with <span className="text-pink-500">♥</span> by{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Abdulmecid
          </span>
        </p>
      </div>
    </footer>
  );
}
