import PropTypes from 'prop-types';
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

Notification.propTypes = {
  // shape instead of Object so it can be specified by property
  // and Shape instead of objectOf because the categories are known before
  messageInfo: PropTypes.shape({
    message: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  // Required at the end, so the component need the blog name
};

export default Notification;
