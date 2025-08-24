'use client'
type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};
export default function Home({ children, params }: RootLayoutProps) {
  return (
   <p>Trang chu</p>
  );
}
