interface IRootLayout {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<IRootLayout>) {
  return children;
}
