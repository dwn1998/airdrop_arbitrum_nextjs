import MintTokenFrame from './MintTokenFrame';
import styles from './Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <MintTokenFrame />
    </div>
  );
};

export default Home;
