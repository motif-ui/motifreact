import type { Meta, StoryObj } from "@storybook/nextjs";
import Button from "../../../lib/components/Button/Button";
import styles from "./figma.module.scss";

const meta: Meta = {
  title: "_Hidden/Figma",
  tags: ["!autodocs", "!dev"],
};

export default meta;
type Story = StoryObj;
export const FigmaImg: Story = {
  render: () => (
    <div className={styles.heroSection}>
      <div className={styles.heroHeader}>
        <svg width="48" height="48" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19 28.5C19 23.8056 22.8056 20 27.5 20C32.1944 20 36 23.8056 36 28.5C36 33.1944 32.1944 37 27.5 37C22.8056 37 19 33.1944 19 28.5Z"
            fill="#1ABCFE"
          />
          <path
            d="M0 46.5C0 41.8056 3.80558 38 8.5 38H19V46.5C19 51.1944 15.1944 55 10.5 55C5.80558 55 2 51.1944 2 46.5H0Z"
            fill="#0ACF83"
          />
          <path d="M19 0V19H27.5C32.1944 19 36 15.1944 36 10.5C36 5.80558 32.1944 2 27.5 2H19V0Z" fill="#FF7262" />
          <path d="M0 10.5C0 15.1944 3.80558 19 8.5 19H19V2H8.5C3.80558 2 0 5.80558 0 10.5Z" fill="#F24E1E" />
          <path d="M0 28.5C0 33.1944 3.80558 37 8.5 37H19V20H8.5C3.80558 20 0 23.8056 0 28.5Z" fill="#A259FF" />
        </svg>
        <div>
          <h3 className={styles.heroTitle}>Motif UI Design System</h3>
          <p className={styles.heroSubtitle}>Components, tokens, and patterns built in Figma</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <span className={`${styles.statNumber}`}>50+</span>
          <span className={styles.statLabel}>Components</span>
        </div>
        <div className={styles.statItem}>
          <span className={`${styles.statNumber}`}>200+</span>
          <span className={styles.statLabel}>Design Tokens</span>
        </div>
        <div className={styles.statItem}>
          <span className={`${styles.statNumber}`}>2</span>
          <span className={styles.statLabel}>Themes</span>
        </div>
      </div>
    </div>
  ),
};

export const FigmaInspect: Story = {
  render: () => (
    <>
      <div className={styles.figmaInspect}>
        <div className={styles.figmaInspectHeader}>
          <span className={styles.figmaInspectTitle}>Motif UI Team Project / Buttons</span>
          <span className={styles.figmaInspectBadge}>Component</span>
        </div>

        <div className={styles.figmaLayout}>
          <div className={styles.figmaFrame}>
            <div className={styles.buttonPreview}>
              <div className={styles.selectedButton}>
                <Button variant="primary" size="sm" label="Primary" />
              </div>
              <Button variant="secondary" size="sm" label="Secondary" />
              <Button variant="success" size="sm" label="Success" />
              <Button variant="danger" size="sm" label="Danger" />
              <Button variant="warning" size="sm" label="Warning" />
            </div>
          </div>

          <div className={styles.figmaProperties}>
            <div className={styles.figmaPropertiesSection}>
              <span className={styles.figmaPropertiesTitle}>Properties</span>
              <div className={styles.figmaProperty}>
                <span className={styles.figmaPropertyLabel}>State</span>
                <span className={styles.figmaPropertyValue}>Default , Hover, Focus, Active, Disabled</span>
              </div>
              <div className={styles.figmaProperty}>
                <span className={styles.figmaPropertyLabel}>Size</span>
                <span className={styles.figmaPropertyValue}>xs, sm, md, lg, xl</span>
              </div>
              <div className={styles.figmaProperty}>
                <span className={styles.figmaPropertyLabel}>Shape</span>
                <span className={styles.figmaPropertyValue}>Solid, Outline, Text Only</span>
              </div>
            </div>

            <div className={styles.figmaPropertiesSection}>
              <span className={styles.figmaPropertiesTitle}>Design Tokens</span>
              <div className={styles.tokenAnnotation}>
                <span className={styles.tokenLabel}>Fill</span>
                <code className={styles.tokenValue}>color/semantic/primary/500</code>
              </div>
              <div className={styles.tokenAnnotation}>
                <span className={styles.tokenLabel}>Padding</span>
                <code className={styles.tokenValue}>sizing/4x</code>
              </div>
              <div className={styles.tokenAnnotation}>
                <span className={styles.tokenLabel}>Radius</span>
                <code className={styles.tokenValue}>sizing/radius/sm</code>
              </div>
              <div className={styles.tokenAnnotation}>
                <span className={styles.tokenLabel}>Font</span>
                <code className={styles.tokenValue}>typography/font-size/xs</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ),
};

export const FigmaDesignToken: Story = {
  render: () => (
    <div className={styles.tokenWorkflow}>
      <div className={styles.workflowStep}>
        <span className={styles.workflowIcon}>🎨</span>
        <span className={styles.workflowTitle}>1. Export from Figma</span>
        <span className={styles.workflowDescription}>via Token Studio plugin </span>
      </div>

      <div className={styles.workflowArrow}>→</div>

      <div className={styles.workflowStep}>
        <span className={styles.workflowIcon}>⚙️</span>
        <span className={styles.workflowTitle}>2. Transform</span>
        <div className={styles.workflowDescription}>
          <code>npm run build:tokens</code>
        </div>
      </div>

      <div className={styles.workflowArrow}>→</div>

      <div className={styles.workflowStep}>
        <span className={styles.workflowIcon}>✅</span>
        <span className={styles.workflowTitle}>3. Use in Code</span>
        <span className={styles.workflowDescription}>CSS variables</span>
      </div>
    </div>
  ),
};
