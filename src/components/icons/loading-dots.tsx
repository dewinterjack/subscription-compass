import styles from "./loading-dots.module.css";

const LoadingDots = () => {
  return (
    <span className={styles.loading}>
      <span className="bg-foreground" />
      <span className="bg-foreground" />
      <span className="bg-foreground" />
    </span>
  );
};

export default LoadingDots;
