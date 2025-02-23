export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div>
        Authentication Pages
        {children}
        
      </div>
    );
  }