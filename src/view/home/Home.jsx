import DigitalClock from "../../components/DigitalClock/DigitalClock";
import QuotesSection from "../../components/QuotesSection/QuotesSection";
import "./Home.css";

export default function Home() {
  return (
    <section className="home-page">
      <div className="home-hero">
        <DigitalClock />
        <div className="home-scroll-hint" aria-hidden="true">
          {/* <span>向下探索</span> */}
          <span className="home-scroll-hint-arrow">↓</span>
        </div>
      </div>

      <div className="home-quotes">
        <QuotesSection />
      </div>
    </section>
  );
}
