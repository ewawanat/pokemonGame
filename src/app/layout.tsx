export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f8ff', color: '#333' }}>
        <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
