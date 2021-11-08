// This style sheet was created specifically for this component
import styles from './Notification.module.css';

const Notification = ({ messageInfo }) => {
  if (messageInfo === null) {
    return (
      null
    );
  }

  const { message, status } = messageInfo;

  // This will give the styles of each of the messages
  if (status === 'positive') {
    return (
      <div className={styles.positiveContainer}>
        <h2 className={styles.positiveMessage}>{message}</h2>
      </div>
    );
  }

  // If it's not positive, it will return the negative response
  return (
    <div className={styles.negativeContainer}>
      <h2 className={styles.negativeMessage}>{message}</h2>
    </div>
  );
};
export default Notification;
