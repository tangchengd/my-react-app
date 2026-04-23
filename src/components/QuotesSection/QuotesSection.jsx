import { useEffect, useRef, useState } from "react";
import refreshIcon from "./refresh.svg";
import "./QuotesSection.css";

// 功能：语录接口地址，返回一条 hitokoto 文本。
// 参数：无。
// 返回：字符串常量，供 fetch 请求使用。
const QUOTE_API = "https://v1.hitokoto.cn/?c=d&c=i&encode=json";

// 功能：控制首页语录卡片数量。
// 参数：无。
// 返回：数字常量，表示要渲染的卡片数。
const CARD_COUNT = 3;

// 功能：创建语录卡片的初始状态数组。
// 参数：无。
// 返回：长度为 CARD_COUNT 的数组，每一项都包含 id、text、loading、error。
function createInitialQuotes() {
  return Array.from({ length: CARD_COUNT }, (_, index) => ({
    id: index,
    text: "",
    loading: true,
    error: "",
  }));
}

// 功能：渲染单张语录卡片。
// 参数：
// - quote: 当前卡片的状态对象，包含 text、loading、error。
// - onRefresh: 点击刷新按钮时触发的回调函数。
// 返回：单张语录卡片 JSX。
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
          <img className="quote-card-refresh-icon" src={refreshIcon} alt="" />
        </button>
      </div>
    </article>
  );
}

// 功能：渲染首页语录区域，负责请求语录、刷新语录和控制进入视口动画。
// 参数：无。
// 返回：语录区域 JSX。
export default function QuotesSection() {
  // 功能：保存三张语录卡片的文本和加载状态。
  // 参数：初始值由 createInitialQuotes() 生成。
  // 返回：语录数组状态和更新函数。
  const [quotes, setQuotes] = useState(createInitialQuotes);

  // 功能：记录语录区是否已经进入视口，用于触发淡入上移动画。
  // 参数：初始值为 false，表示初始不可见。
  // 返回：布尔状态和更新函数。
  const [isVisible, setIsVisible] = useState(false);

  // 功能：保存语录区 DOM 引用，供 IntersectionObserver 监听。
  // 参数：初始值为 null。
  // 返回：ref 对象，current 指向真实 DOM。
  const sectionRef = useRef(null);

  // 功能：请求一条新的语录文本。
  // 参数：无。
  // 返回：Promise<string>，成功时返回 hitokoto 字段内容。
  async function fetchQuote() {
    const response = await fetch(`${QUOTE_API}&t=${Date.now()}-${Math.random()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();
    return data.hitokoto;
  }

  // 功能：刷新指定索引的语录卡片。
  // 参数：
  // - index: number，表示要更新的卡片下标。
  // 返回：Promise<void>，通过状态更新驱动界面变化。
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

  // 功能：组件首次挂载时，主动请求三张卡片的语录内容。
  // 参数：无。
  // 返回：无返回值，副作用是触发三次 updateQuote()。
  useEffect(() => {
    Array.from({ length: CARD_COUNT }, (_, index) => updateQuote(index));
  }, []);

  // 功能：监听语录区是否进入视口，进入后触发出现动画并停止观察。
  // 参数：无。
  // 返回：清理函数，用于断开 IntersectionObserver。
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
      {/* 标题区域：给语录区一个轻量标题。 */}
      <div className="quotes-section-heading">
        <p className="quotes-section-eyebrow">Quotes</p>
        <h2>今日语录</h2>
      </div>

      {/* 卡片网格：通过 map 渲染三张独立语录卡片。 */}
      <div className="quotes-grid">
        {quotes.map((quote, index) => (
          // 每张卡片额外包一层 wrapper，用于做交错出现动画。
          <div key={quote.id} className="quote-card-wrapper" style={{ transitionDelay: `${index * 80}ms` }}>
            <QuoteCard quote={quote} onRefresh={() => updateQuote(index)} />
          </div>
        ))}
      </div>
    </section>
  );
}
