const Footer = () => {
  return (
    <footer id="footer" className="bg-red-900 text-white">
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-8">
        <div className="max-w-md">
          <h3 className="font-bold text-lg">Health Reco</h3>
          <p className="text-sm mt-2 text-white/80">
            Spersonalizowane rekomendacje zdrowotne. Naszym celem jest pomóc Ci
            podejmować lepsze decyzje dotyczące zdrowia w oparciu o dane Twojej
            krwi.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="text-sm">
            <p className="font-semibold">KONTAKT</p>
            <address className="not-italic mt-2 text-xs md:text-sm text-white/90">
              ul. Kaszubska
              <br />
              44-100 Gliwice
              <br />
              Email:{" "}
              <a className="underline" href="mailto:healthrecoapp@health.pl">
                healthreco@health.pl
              </a>
            </address>
            <p className="mt-3 text-xs">
              © {new Date().getFullYear()} Health Reco - Wszelkie prawa
              zastrzeżone.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
