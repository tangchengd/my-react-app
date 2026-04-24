import { useEffect, useState } from "react";
import baoyuIcon from "../../assets/weather/baoyu.png";
import dayIcon from "../../assets/weather/day.png";
import dayuIcon from "../../assets/weather/dayu.png";
import duoyunIcon from "../../assets/weather/duoyun.png";
import leizhenyuIcon from "../../assets/weather/leizhenyu.png";
import nightIcon from "../../assets/weather/night.png";
import qingIcon from "../../assets/weather/qing.png";
import richuIcon from "../../assets/weather/richu.png";
import riluoIcon from "../../assets/weather/riluo.png";
import wuIcon from "../../assets/weather/wu.png";
import xiaoyuIcon from "../../assets/weather/xiaoyu.png";
import yinIcon from "../../assets/weather/yin.png";
import zhongyuIcon from "../../assets/weather/zhongyu.png";
import "./WeatherForecast.css";

const DEFAULT_QUERY = "长沙";
const WEATHER_API_BASE = "https://60s.viki.moe/v2/weather/forecast";
const HOT_CITIES = ["长沙", "北京", "上海", "广州", "深圳", "杭州", "成都", "武汉", "西安", "重庆"];
const WEATHER_ICON_MAP = {
  晴: qingIcon,
  多云: duoyunIcon,
  阴: yinIcon,
  小雨: xiaoyuIcon,
  中雨: zhongyuIcon,
  大雨: dayuIcon,
  暴雨: baoyuIcon,
  雷阵雨: leizhenyuIcon,
  雾: wuIcon,
};

// 功能：把常见天气文案先做一层“精确映射”。
// 参数：无。
// 返回：天气中文描述到本地图标资源的对照表。
// 说明：如果接口返回的是更复杂的组合天气，例如“阵雨转多云”，会在 getWeatherIconByCondition 里继续走兜底匹配。

// 功能：根据接口返回的中文天气描述，映射到本地天气图标。
// 参数：condition，天气描述文本。
// 返回：对应的本地图片路径。
function getWeatherIconByCondition(condition) {
  if (!condition) {
    return duoyunIcon;
  }

  if (WEATHER_ICON_MAP[condition]) {
    return WEATHER_ICON_MAP[condition];
  }

  if (condition.includes("雷")) {
    return leizhenyuIcon;
  }

  if (condition.includes("暴雨")) {
    return baoyuIcon;
  }

  if (condition.includes("大雨")) {
    return dayuIcon;
  }

  if (condition.includes("中雨")) {
    return zhongyuIcon;
  }

  if (condition.includes("雨")) {
    return xiaoyuIcon;
  }

  if (condition.includes("雾")) {
    return wuIcon;
  }

  if (condition.includes("阴")) {
    return yinIcon;
  }

  if (condition.includes("云")) {
    return duoyunIcon;
  }

  if (condition.includes("晴")) {
    return qingIcon;
  }

  return duoyunIcon;
}

// 功能：根据输入内容和热门城市生成联想候选项。
// 参数：keyword，当前输入框内容。
// 返回：适合展示的城市候选数组。
function getSuggestions(keyword) {
  const nextKeyword = keyword.trim();

  if (!nextKeyword) {
    return HOT_CITIES.slice(0, 6);
  }

  const matchedCities = HOT_CITIES.filter((city) => city.includes(nextKeyword));

  if (matchedCities.some((city) => city === nextKeyword)) {
    return matchedCities.slice(0, 6);
  }

  return [nextKeyword, ...matchedCities].slice(0, 6);
}

// 功能：根据异常对象和输入内容生成更细的错误提示。
// 参数：requestError，异常对象；query，当前查询城市名。
// 返回：适合展示的错误文案。
function getErrorMessage(requestError, query) {
  if (!query.trim()) {
    return "请输入城市名称后再查询。";
  }

  if (requestError?.name === "AbortError") {
    return "本次查询已取消，请重新发起查询。";
  }

  if (!navigator.onLine) {
    return "当前网络似乎已断开，请检查网络连接后重试。";
  }

  const message = requestError?.message || "";

  if (message.includes("未找到城市")) {
    return `未找到“${query}”对应的城市，请尝试更完整的城市名称。`;
  }

  if (message.includes("Failed to fetch")) {
    return "天气接口请求失败，可能是跨域、网络波动或服务暂时不可用。";
  }

  if (message.includes("天气服务暂时不可用")) {
    return "天气服务当前返回异常，请稍后再试。";
  }

  return message || "天气查询失败，请稍后重试。";
}

// 功能：根据城市名请求天气预报接口。
// 参数：query，表示要查询的城市名称。
// 返回：接口返回的 JSON 数据。
async function fetchWeatherForecast(query, signal) {
  const url = new URL(WEATHER_API_BASE);
  url.searchParams.set("query", query);
  url.searchParams.set("days", "7");

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error("天气服务暂时不可用，请稍后重试。");
  }

  return response.json();
}

// 功能：把接口返回的时间字符串格式化成更易读的展示文本。
// 参数：value，格式类似 2026-04-24 11:00。
// 返回：格式化后的时间文本。
function formatDateTime(value) {
  const date = new Date(value.replace(" ", "T"));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// 功能：把日期字符串格式化成月日展示。
// 参数：value，格式类似 2026-04-24。
// 返回：格式化后的日期文本。
function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

// 功能：渲染天气查询页面，支持城市天气预报搜索与结果展示。
// 参数：无。
// 返回：天气查询页面 JSX。
export default function WeatherForecast() {
  // 这几个状态分别负责：
  // - query：真正用于发请求的城市名
  // - keyword：输入框当前内容
  // - weatherData：接口成功后的天气数据
  // - loading：请求中的加载态
  // - error：错误提示文案
  // - activeSuggestion：键盘上下选择时当前高亮的联想项索引
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [keyword, setKeyword] = useState(DEFAULT_QUERY);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  // 根据输入框内容实时生成联想列表。
  // 这里不走接口，直接用本地热门城市做轻量筛选，避免输入时产生额外网络请求。
  const suggestions = getSuggestions(keyword);

  useEffect(() => {
    // 每次 query 改变都创建一个新的取消控制器。
    // 这样用户连续切城市时，旧请求会被主动中断，避免后返回的数据覆盖新结果。
    const controller = new AbortController();

    async function loadWeather() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchWeatherForecast(query, controller.signal);

        if (result.code !== 200) {
          throw new Error(result.data?.error || result.message || "天气查询失败，请检查城市名称。");
        }

        setWeatherData(result.data);
      } catch (requestError) {
        if (controller.signal.aborted) {
          return;
        }

        setWeatherData(null);
        setError(getErrorMessage(requestError, query));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadWeather();

    return () => {
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    // 输入内容一变化，就把联想高亮重置到“未选中”状态。
    // 这样可以避免上一次的方向键选中状态错误复用到新的联想列表上。
    setActiveSuggestion(-1);
  }, [keyword]);

  // 功能：提交搜索表单后发起新的天气查询。
  // 参数：event，表单提交事件对象。
  // 返回：无返回值，副作用是更新 query。
  function handleSubmit(event) {
    event.preventDefault();

    const nextQuery = keyword.trim();

    if (!nextQuery) {
      setWeatherData(null);
      setError("请输入城市名称后再查询。");
      return;
    }

    setKeyword(nextQuery);
    setQuery(nextQuery);
  }

  // 功能：应用选中的联想项并立即触发查询。
  // 参数：city，联想城市名称。
  // 返回：无返回值，副作用是更新输入值和查询值。
  function applySuggestion(city) {
    setKeyword(city);
    setQuery(city);
    setError("");
  }

  // 功能：处理输入框键盘交互，让回车和方向键可用于联想选择。
  // 参数：event，键盘事件对象。
  // 返回：无返回值，副作用是更新联想激活项或触发查询。
  function handleInputKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestion((currentIndex) => (currentIndex + 1) % suggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestion((currentIndex) => (currentIndex <= 0 ? suggestions.length - 1 : currentIndex - 1));
      return;
    }

    if (event.key === "Enter" && activeSuggestion >= 0) {
      event.preventDefault();
      applySuggestion(suggestions[activeSuggestion]);
    }
  }

  const location = weatherData?.location;
  const dailyForecast = weatherData?.daily_forecast ?? [];
  const hourlyForecast = weatherData?.hourly_forecast ?? [];
  const sunriseSunset = weatherData?.sunrise_sunset?.[0];

  return (
    <section className="weather-page">
      {/* 顶部首屏区域：左侧是页面标题，右侧是搜索入口。 */}
      <div className="weather-hero">
        <div className="weather-hero-copy">
          <span className="weather-kicker">Weather Forecast</span>
          <h1>天气预报查询</h1>
          <p>输入城市名称，查看未来天气、小时预报和日出日落信息。</p>
        </div>

        <form className="weather-search" onSubmit={handleSubmit}>
          <label className="weather-search-label" htmlFor="weather-query">
            城市名称
          </label>

          {/* 搜索输入区：支持直接查询，也支持键盘联想选择。 */}
          <div className="weather-search-row">
            <input
              id="weather-query"
              className="weather-search-input"
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="例如：长沙、北京、上海"
              autoComplete="off"
            />
            <button className="weather-search-button" type="submit" disabled={loading}>
              {loading ? "查询中..." : "查询天气"}
            </button>
          </div>

          {/* 联想词区：展示根据当前输入实时生成的候选城市。 */}
          <div className="weather-suggestions" aria-label="搜索联想">
            {suggestions.map((city, index) => (
              <button
                key={city}
                type="button"
                className={`weather-suggestion-chip${index === activeSuggestion ? " weather-suggestion-chip-active" : ""}`}
                onMouseDown={() => applySuggestion(city)}
              >
                {city}
              </button>
            ))}
          </div>

          {/* 热门城市区：提供几个固定快捷入口，降低首次使用成本。 */}
          <div className="weather-hot-cities" aria-label="热门城市">
            <span className="weather-hot-cities-label">热门城市</span>
            <div className="weather-hot-cities-list">
              {HOT_CITIES.map((city) => (
                <button key={city} type="button" className="weather-hot-city-button" onClick={() => applySuggestion(city)}>
                  {city}
                </button>
              ))}
            </div>
          </div>
          <p className="weather-search-tip">接口来源：60s.viki.moe，支持城市名称模糊查询。</p>
        </form>
      </div>

      {/* 错误提示区：只有请求失败或输入无效时才展示。 */}
      {error ? <div className="weather-feedback weather-feedback-error">{error}</div> : null}

      {loading ? (
        // 骨架屏结构尽量贴近最终布局，这样加载完成后页面跳动会更小。
        <div className="weather-content weather-content-loading" aria-hidden="true">
          <section className="weather-summary-card weather-skeleton-card">
            <div className="weather-skeleton-block weather-skeleton-title" />
            <div className="weather-summary-metrics">
              <div className="weather-metric weather-skeleton-metric" />
              <div className="weather-metric weather-skeleton-metric" />
              <div className="weather-metric weather-skeleton-metric" />
            </div>
          </section>

          <section className="weather-section">
            <div className="weather-section-heading">
              <div className="weather-skeleton-block weather-skeleton-heading" />
              <div className="weather-skeleton-block weather-skeleton-subheading" />
            </div>

            <div className="weather-daily-grid">
              {Array.from({ length: 4 }).map((_, index) => (
                <article className="weather-daily-card weather-skeleton-card" key={`daily-skeleton-${index}`}>
                  <div className="weather-skeleton-block weather-skeleton-date" />
                  <div className="weather-skeleton-block weather-skeleton-line" />
                  <div className="weather-skeleton-block weather-skeleton-line weather-skeleton-line-short" />
                  <div className="weather-skeleton-block weather-skeleton-line" />
                </article>
              ))}
            </div>
          </section>

          <section className="weather-section">
            <div className="weather-section-heading">
              <div className="weather-skeleton-block weather-skeleton-heading" />
              <div className="weather-skeleton-block weather-skeleton-subheading" />
            </div>

            <div className="weather-hourly-grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <article className="weather-hourly-card weather-skeleton-card" key={`hourly-skeleton-${index}`}>
                  <div className="weather-skeleton-block weather-skeleton-date" />
                  <div className="weather-skeleton-block weather-skeleton-icon" />
                  <div className="weather-skeleton-block weather-skeleton-line weather-skeleton-line-short" />
                  <div className="weather-skeleton-block weather-skeleton-line" />
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {!loading && weatherData ? (
        <div className="weather-content">
          {/* 顶部摘要卡：概览当前地区、日出日落和预报天数。 */}
          <section className="weather-summary-card">
            <div>
              <p className="weather-summary-label">当前城市</p>
              <h2>{location?.name || query}</h2>
              <p className="weather-summary-location">
                {[location?.province, location?.city, location?.county].filter(Boolean).join(" ") || "未返回详细地区信息"}
              </p>
            </div>

            <div className="weather-summary-metrics">
              <div className="weather-metric">
                <img className="weather-metric-icon" src={richuIcon} alt="日出图标" />
                <span>日出</span>
                <strong>{sunriseSunset?.sunrise_desc || "--:--"}</strong>
              </div>
              <div className="weather-metric">
                <img className="weather-metric-icon" src={riluoIcon} alt="日落图标" />
                <span>日落</span>
                <strong>{sunriseSunset?.sunset_desc || "--:--"}</strong>
              </div>
              <div className="weather-metric">
                <span>预报天数</span>
                <strong>{dailyForecast.length || 0} 天</strong>
              </div>
            </div>
          </section>

          {/* 逐日预报区：适合看未来几天整体趋势。 */}
          <section className="weather-section">
            <div className="weather-section-heading">
              <h3>未来天气</h3>
            </div>

            <div className="weather-daily-grid">
              {dailyForecast.map((item) => (
                <article className="weather-daily-card" key={item.date}>
                  <div className="weather-daily-top">
                    <div>
                      <p className="weather-card-date">{formatDate(item.date)}</p>
                      <h4>
                        {item.day_condition} / {item.night_condition}
                      </h4>
                    </div>
                    <div className="weather-card-icons">
                      <img src={dayIcon} alt={`${item.day_condition} 白天图标`} />
                      <img src={nightIcon} alt={`${item.night_condition} 夜间图标`} />
                    </div>
                  </div>

                  <p className="weather-card-temp">
                    {item.min_temperature}°C - {item.max_temperature}°C
                  </p>

                  <dl className="weather-card-details">
                    <div>
                      <dt>白天风向</dt>
                      <dd>
                        {item.day_wind_direction} {item.day_wind_power}级
                      </dd>
                    </div>
                    <div>
                      <dt>夜间风向</dt>
                      <dd>
                        {item.night_wind_direction} {item.night_wind_power}级
                      </dd>
                    </div>
                    <div>
                      <dt>空气质量</dt>
                      <dd>
                        {item.air_quality} · AQI {item.aqi}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>

          {/* 小时预报区：改成横向滚动，保留更多时段数据。 */}
          <section className="weather-section">
            <div className="weather-section-heading">
              <h3>小时预报</h3>
            </div>

            <div className="weather-hourly-hint">左右滑动查看更多时段天气</div>

            <div className="weather-hourly-grid" role="region" aria-label="小时预报滚动列表">
              {hourlyForecast.map((item) => (
                <article className="weather-hourly-card" key={item.datetime}>
                  <p className="weather-card-date">{formatDateTime(item.datetime)}</p>
                  <img src={getWeatherIconByCondition(item.condition)} alt={item.condition} />
                  <strong>{item.temperature}°C</strong>
                  <span>{item.condition}</span>
                  <small>
                    {item.wind_direction} {item.wind_power}级
                  </small>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
