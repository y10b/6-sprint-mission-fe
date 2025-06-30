import QueryProvider from "@/app/QueryProvider";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "판다마켓",
  description: "판다마켓에서 중고거래를 해보세요",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-pretendard">
        <QueryProvider>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
