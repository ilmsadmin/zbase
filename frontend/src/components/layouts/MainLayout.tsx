import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";
import { PropsWithChildren } from "react";

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <Breadcrumbs />
      <main className="flex-grow relative z-0">{children}</main>
      <Footer />
    </div>
  );
}
