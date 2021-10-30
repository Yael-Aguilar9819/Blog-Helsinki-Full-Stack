const Notification = ({messageInfo}) => {
    const {message, status} = messageInfo
    if (message === null) {
      return (
        null
      )
    }
  
    // This will give the styles of each of the messages
    else if (status === "positive") {
      return (
        <div className={styles.positiveContainer}>
          <h2 className={styles.positiveMessage}>{message}</h2>
        </div>
      )  
    }
  
  
    //If it's not positive, it will return the negative response
    return (
      <div className={styles.negativeContainer}>
        <h2 className={styles.negativeMessage}>{message}</h2>
      </div>
    )  
  
  
    
  };
  export default Notification