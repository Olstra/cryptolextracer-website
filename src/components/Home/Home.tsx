import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.sass";
import {
  projectTitle,
  projectBackground,
  projectObjectives,
} from "./projectDescriptionText";

export const Home: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="content-section">
      <h1 className={styles.aboutTitle}>{projectTitle}</h1>

      <div className={styles.sectionBlock}>
        {/* Paragraph 1 - Always visible */}
        <p className={styles.aboutParagraph}>{projectBackground[0]}</p>

        {/* Paragraphs 2 & 3 - Collapsible on mobile */}
        <div
          className={`${styles.collapsibleWrapper} ${
            isExpanded ? styles.expanded : ""
          }`}
        >
          {projectBackground.slice(1).map((paragraph, index) => (
            <p key={index} className={styles.aboutParagraph}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Toggle Button - Mobile only */}
        <button
          className={styles.toggleBtn}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show less ▲" : "Show more ▼"}
        </button>
      </div>

      <div className={styles.sectionBlock}>
        <h2 className={styles.sectionHeading}>
          What you can find on this website:
        </h2>
        <div className={styles.objectivesGrid}>
          {projectObjectives.map((obj) => (
            <Link
              key={obj.title}
              to={obj.path}
              className={styles.objectiveCard}
            >
              <div className={styles.headerRow}>
                {obj.emoji && (
                  <div className={styles.emojiBox}>{obj.emoji}</div>
                )}
                <div className={styles.objectiveCode}>{obj.title}</div>
              </div>
              <p className={styles.objectiveDesc}>{obj.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
