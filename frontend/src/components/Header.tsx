import { useAppContext } from "../../contexts/AppContext";
import SignOutButton from "./SignOutButton";
import { Link } from "react-router-dom";

const Header = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <span className="w-full bg-red-900">
      <div className="container mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="text-white font-bold text-2xl md:text-3xl">
          HEALTH RECO
        </Link>
        <span className="text-white text-sm md:text-base">
          Twoje zdrowe decyzje, każdego dnia
        </span>
      </div>
      {isLoggedIn ? (
        <SignOutButton />
      ) : (
        <Link
          to="/sign-in"
          className="font-bold text-white underline mr-6 mb-4 block justify-self-end"
        >
          Zaloguj się
        </Link>
      )}
    </span>
  );
};

export default Header;
