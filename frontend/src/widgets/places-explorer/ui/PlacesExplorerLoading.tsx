import Image from 'next/image';

export function PlacesExplorerLoading() {
  return (
    <main
      className="relative h-dvh w-full overflow-hidden bg-surface text-foreground"
      lang="ru"
      aria-busy="true"
    >
      <div className="absolute top-4 left-4 w-[min(22.5rem,calc(100%-2rem))] rounded-lg border border-border bg-background shadow-panel">
        <div className="flex items-center border-b border-border p-4">
          <h1>
            <Image
              src="/brand/fitplace-logo.svg"
              alt="Fitplace"
              width={160}
              height={43}
              className="h-auto w-40"
            />
          </h1>
        </div>
        <p
          className="px-4 py-6 text-[13px] text-muted-foreground"
          role="status"
        >
          Загружаем места...
        </p>
      </div>
    </main>
  );
}
