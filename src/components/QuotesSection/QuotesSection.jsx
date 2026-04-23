import { useEffect, useRef, useState } from "react";
import "./QuotesSection.css";

const QUOTE_API = "https://v1.hitokoto.cn/?c=d&c=i&encode=json";
const CARD_COUNT = 3;

function createInitialQuotes() {
  return Array.from({ length: CARD_COUNT }, (_, index) => ({
    id: index,
    text: "",
    loading: true,
    error: "",
  }));
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="quote-card-refresh-icon">
      <path
        d="M20 11a8 8 0 1 0 2.1 5.4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M20 4v7h-7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function QuoteCard({ quote, onRefresh }) {
  return (
    <article className={`quote-card${quote.loading ? " quote-card-loading" : ""}`}>
      <div className="quote-card-body">
        {quote.loading ? (
          <p className="quote-card-state">加载中...</p>
        ) : quote.error ? (
          <p className="quote-card-state quote-card-state-error">{quote.error}</p>
        ) : (
          <p className="quote-card-text">“{quote.text}”</p>
        )}
      </div>

      <div className="quote-card-footer">
        <button
          type="button"
          className={`quote-card-refresh${quote.loading ? " quote-card-refresh-loading" : ""}`}
          onClick={onRefresh}
          disabled={quote.loading}
          aria-label="刷新语录"
          title="刷新语录"
        >
          <RefreshIcon />
        </button>
      </div>
    </article>
  );
}

export default function QuotesSection() {
  const [quotes, setQuotes] = useState(createInitialQuotes);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  async function fetchQuote() {
    const response = await fetch(QUOTE_API);

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();
    return data.hitokoto;
  }

  async function updateQuote(index) {
    setQuotes((currentQuotes) =>
      currentQuotes.map((quote, currentIndex) =>
        currentIndex === index
          ? {
              ...quote,
              loading: true,
              error: "",
            }
          : quote,
      ),
    );

    try {
      const text = await fetchQuote();

      setQuotes((currentQuotes) =>
        currentQuotes.map((quote, currentIndex) =>
          currentIndex === index
            ? {
                ...quote,
                text,
                loading: false,
                error: "",
              }
            : quote,
        ),
      );
    } catch {
      setQuotes((currentQuotes) =>
        currentQuotes.map((quote, currentIndex) =>
          currentIndex === index
            ? {
                ...quote,
                loading: false,
                error: "获取语录失败，请重试",
              }
            : quote,
        ),
      );
    }
  }

  useEffect(() => {
    quotes.forEach((quote, index) => {
      if (quote.loading && !quote.text && !quote.error) {
        updateQuote(index);
      }
    });
  }, []);

  useEffect(() => {
    const target = sectionRef.current;

    if (!target) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.18,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className={`quotes-section${isVisible ? " quotes-section-visible" : ""}`}>
      <div className="quotes-section-heading">
        <p className="quotes-section-eyebrow">Quotes</p>
        <h2>今日语录</h2>
      </div>

      <div className="quotes-grid">
        {quotes.map((quote, index) => (
          <div key={quote.id} className="quote-card-wrapper" style={{ transitionDelay: `${index * 80}ms` }}>
            <QuoteCard quote={quote} onRefresh={() => updateQuote(index)} />
          </div>
        ))}
      </div>
    </section>
  );
}
