import { useAppContext } from "../../contexts/AppContext";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <div>
      <h1 className="font-bold text-xl md:text-md">W trosce o Twoje zdrowie</h1>
      <p className="mt-4 text-sm md:text-base">
        Witamy w Health Reco App – Twoim zaufanym partnerze w dbaniu o zdrowie!
        Nasza aplikacja oferuje spersonalizowane rekomendacje zdrowotne oparte
        na analizie danych z Twojej krwi. Dzięki zaawansowanym algorytmom
        uczenia maszynowego pomagamy Ci podejmować świadome decyzje dotyczące
        Twojego zdrowia. Zarejestruj się już dziś i zacznij swoją podróż ku
        lepszemu samopoczuciu z Health Reco App!
      </p>

      {isLoggedIn ? (
        <Link
          to="/user-profile"
          className="underline text-sm md:text-base mt-6 block font-semibold"
        >
          Moje wyniki krwi
        </Link>
      ) : (
        <span></span>
      )}
    </div>
  );
};

export default HomePage;
