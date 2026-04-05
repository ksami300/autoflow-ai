export const metadata = {
  title: "AI Plan Ishrane",
  description: "AI aplikacija za generisanje planova ishrane",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sr">
      <body>{children}</body>
    </html>
  );
}