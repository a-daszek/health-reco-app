import Footer from "../components/Footer";
import Header from "../components/Header";

type Props = {
  children: React.ReactNode;
  showBigHeader?: boolean;
  showSmallHeader?: boolean;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="w-full flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
