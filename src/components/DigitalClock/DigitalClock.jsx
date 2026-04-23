import { useEffect, useState } from "react";
import "./DigitalClock.css";

// 功能：格式化星期显示，例如“星期四”。
// 参数：无。
// 返回：Intl.DateTimeFormat 实例。
const weekdayFormatter = new Intl.DateTimeFormat("zh-CN", {
  weekday: "long",
});

// 功能：格式化农历干支年份，例如“乙巳年”。
// 参数：无。
// 返回：Intl.DateTimeFormat 实例。
const chineseYearFormatter = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
  year: "numeric",
});

// 功能：渲染首页数字时钟组件，显示时间、干支年、公历日期和标题文案。
// 参数：无。
// 返回：时钟组件 JSX。
export default function DigitalClock() {
  // 功能：保存当前时间，用于每秒刷新页面显示。
  // 参数：初始值为 new Date()。
  // 返回：Date 状态和更新函数。
  const [time, setTime] = useState(new Date());

  // 功能：每秒更新一次时间，并在组件卸载时清理定时器。
  // 参数：无。
  // 返回：清理函数，用于 clearInterval。
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // 功能：把 Date 对象格式化成数字时钟文本。
  // 参数：
  // - value: Date，当前时间对象。
  // 返回：格式化后的时间字符串，例如 10:46:22 PM。
  function formatTime(value) {
    let hours = value.getHours();
    const minutes = value.getMinutes();
    const seconds = value.getSeconds();
    const meridiem = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)} ${meridiem}`;
  }

  // 功能：为个位数字补零，保证时钟始终显示两位数。
  // 参数：
  // - number: number，需要格式化的数字。
  // 返回：补零后的字符串。
  function padZero(number) {
    return (number < 10 ? "0" : "") + number;
  }

  // 功能：格式化农历干支年份，例如“乙巳年”。
  // 参数：
  // - value: Date，当前时间对象。
  // 返回：干支年份字符串。
  function formatChineseYear(value) {
    const yearText = chineseYearFormatter.format(value);
    const matchedYear = yearText.match(/[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]年/);

    return matchedYear ? matchedYear[0] : yearText;
  }

  // 功能：格式化公历日期和星期文本。
  // 参数：
  // - value: Date，当前时间对象。
  // 返回：日期字符串，例如 2026年4月23日 星期四。
  function formatDate(value) {
    const year = value.getFullYear();
    const month = value.getMonth() + 1;
    const date = value.getDate();
    const weekday = weekdayFormatter.format(value);

    return `${year}年${month}月${date}日 ${weekday}`;
  }

  return (
    <section className="clock-page">
      <div className="clock-container">
        {/* 大号数字时钟主体。 */}
        <div className="clock">
          <span>{formatTime(time)}</span>
        </div>

        {/* 农历干支年份。 */}
        <p className="clock-year">{formatChineseYear(time)}</p>

        {/* 公历日期与星期。 */}
        <p className="clock-date">{formatDate(time)}</p>

        {/* 时钟下方的标题和副标题说明。 */}
        <div className="clock-copy">
          <h2>My React Study</h2>
          <p>一点一点搭建自己的练习空间，把每个功能都沉淀成可见的成长轨迹。</p>
        </div>
      </div>
    </section>
  );
}
