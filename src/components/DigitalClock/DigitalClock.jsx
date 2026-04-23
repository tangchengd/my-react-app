import { useEffect, useState } from "react";
import "./DigitalClock.css";

const weekdayFormatter = new Intl.DateTimeFormat("zh-CN", {
  weekday: "long",
});

const chineseYearFormatter = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
  year: "numeric",
});

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  function formatTime(value) {
    let hours = value.getHours();
    const minutes = value.getMinutes();
    const seconds = value.getSeconds();
    const meridiem = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)} ${meridiem}`;
  }

  function padZero(number) {
    return (number < 10 ? "0" : "") + number;
  }

  function formatChineseYear(value) {
    const yearText = chineseYearFormatter.format(value);
    const matchedYear = yearText.match(/[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]年/);

    return matchedYear ? matchedYear[0] : yearText;
  }

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
        <div className="clock">
          <span>{formatTime(time)}</span>
        </div>
        <p className="clock-year">{formatChineseYear(time)}</p>
        <p className="clock-date">{formatDate(time)}</p>
        <div className="clock-copy">
          <h2>My React Study</h2>
          <p>一点一点搭建自己的练习空间，把每个功能都沉淀成可见的成长轨迹。</p>
        </div>
      </div>
    </section>
  );
}
