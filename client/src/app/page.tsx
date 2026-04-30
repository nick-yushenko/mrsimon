import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Mr Simon</h1>
          <p>Mr Simon Academy</p>
        </div>
      </main>
    </div>
  );
}
