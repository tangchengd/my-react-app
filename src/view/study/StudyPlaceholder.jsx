import "./StudyPlaceholder.css";

export default function StudyPlaceholder({ title, description }) {
  return (
    <section className="study-placeholder">
      <p className="study-placeholder-eyebrow">Study</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}
