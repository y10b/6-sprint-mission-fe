import QueryProvider from "@/app/QueryProvider";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

export const metadata = {
  title: "판다마켓",
  description: "판다마켓에서 중고거래를 해보세요",
  icons: {
    icon: "/favicon.ico",
  },
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
            <ToastProvider>
              <Header />
              <main>{children}</main>
              <Footer />
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
