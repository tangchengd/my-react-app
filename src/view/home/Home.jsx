import { useEffect, useState } from "react";
import DigitalClock from "../../components/DigitalClock/DigitalClock";
import QuotesSection from "../../components/QuotesSection/QuotesSection";
import "./Home.css";

export default function Home() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setHasScrolled(window.scrollY > 20);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="home-page">
      <div className="home-hero">
        <DigitalClock />
        <div className={`home-scroll-hint${hasScrolled ? " home-scroll-hint-hidden" : ""}`} aria-hidden="true">
          <span>向下探索</span>
          <span className="home-scroll-hint-arrow">↓</span>
        </div>
      </div>

      <div className="home-quotes">
        <QuotesSection />
      </div>
    </section>
  );
}
