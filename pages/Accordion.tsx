import React, { useState } from 'react';
import styles from '../styles/slug.module.css'

const Accordion = ({ title, content }:any) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div className={styles.accordionItem}>
      <div 
        className={styles.accordionTitle}
        onClick={() => setIsActive(!isActive)}
      >
        <div>{title}</div>
        <div>{isActive ? '-' : '+'}</div>
      </div>
      {isActive && <div className={styles.accordionContent}>{content}</div>}
    </div>
  );
}

export default Accordion