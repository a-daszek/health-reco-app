import { useAppContext } from "../../contexts/AppContext";
import SignOutButton from "./SignOutButton";
import { Link } from "react-router-dom";

const Header = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <span className="w-full bg-emerald-600">
      <div className="container mx-auto px-6 py-6 flex items-center justify-between">
        <h1 className="text-white font-bold text-2xl md:text-3xl">
          Health Repo App
        </h1>
        <span className="text-white/90 text-sm md:text-base">
          Twoje zdrowe decyzje, każdego dnia
        </span>
      </div>
      {isLoggedIn ? <SignOutButton /> : <Link to="/sign-in">Zaloguj się</Link>}
    </span>
  );
};

export default Header;
