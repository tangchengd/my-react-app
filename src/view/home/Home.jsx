import { useEffect, useState } from "react";
import DigitalClock from "../../components/DigitalClock/DigitalClock";
import QuotesSection from "../../components/QuotesSection/QuotesSection";
import "./Home.css";

// 功能：渲染首页页面，包含首屏时钟区域和下方语录区域。
// 参数：无。
// 返回：首页 JSX。
export default function Home() {
  // 功能：记录用户是否已经开始滚动页面，用于控制底部提示的显示与隐藏。
  // 参数：初始值为 false，表示默认显示“向下探索”提示。
  // 返回：布尔状态值和对应的更新函数。
  const [hasScrolled, setHasScrolled] = useState(false);

  // 功能：监听页面滚动，当用户开始向下滚动后隐藏底部提示。
  // 参数：无。
  // 返回：清理函数，用于移除 scroll 事件监听。
  useEffect(() => {
    // 功能：根据当前滚动距离更新提示是否隐藏。
    // 参数：无，直接读取 window.scrollY。
    // 返回：无返回值，副作用是更新 hasScrolled。
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
      {/* 首屏 Hero 区：进入首页时优先展示时钟主视觉。 */}
      <div className="home-hero">
        <DigitalClock />

        {/* 底部滚动提示：提醒用户页面下方还有语录内容。 */}
        <div className={`home-scroll-hint${hasScrolled ? " home-scroll-hint-hidden" : ""}`} aria-hidden="true">
          <span>向下探索</span>
          <span className="home-scroll-hint-arrow">↓</span>
        </div>
      </div>

      {/* 语录区：向下滚动后展示三张语录卡片。 */}
      <div className="home-quotes">
        <QuotesSection />
      </div>
    </section>
  );
}
