import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";
import { useRef, useState } from "react";
import Button from "@/components/Button";
import BusinessCard from "@/components/BusinessCard";
import { useOutsideClick, useTimeout, useToggle } from "../../../lib/hooks";

const meta: Meta = {
  title: "Hooks/Custom Hooks",
  tags: ["!autodocs", "!dev"],
};
export default meta;

// ============================
// useToggle
// ============================

const style: CSSProperties = {
  padding: 20,
  gap: 10,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const UseToggleStory = () => {
  const { visible, toggleState, show, hide } = useToggle(false, 600);

  const getStatusMessage = () => {
    if (toggleState === "showing") return "Started showing...";
    if (toggleState === "hiding") return "Started hiding...";
    return null;
  };

  return (
    <div style={style}>
      <div>
        <Button label="Show" onClick={show} style={{ margin: 10 }} />
        <Button label="Hide" onClick={hide} style={{ margin: 10 }} />
      </div>

      {(visible || toggleState) && (
        <BusinessCard
          style={{ marginTop: 10 }}
          title="Example Card"
          outline
          description={getStatusMessage() || "This component becomes visible and hides with animation using the useToggle hook."}
        />
      )}
    </div>
  );
};

export const UseToggleExample: StoryObj = {
  render: () => <UseToggleStory />,
};

// ============================
// useTimeout
// ============================

export const UseTimeoutExample: StoryObj = {
  render: () => {
    const UseTimeoutExample = () => {
      const [message, setMessage] = useState("Waiting");
      const [isRunning, setIsRunning] = useState(false);

      const showMessage = () => {
        setMessage("Timeout completed");
        setIsRunning(false);
      };

      const { start, pause, clear } = useTimeout(showMessage, 3000);

      const handleStart = () => {
        setMessage("Timer is running for 3 seconds");
        setIsRunning(true);
        start();
      };

      const handlePause = () => {
        setMessage("Timer paused");
        setIsRunning(false);
        pause();
      };

      const handleClear = () => {
        setMessage("Timer reset");
        setIsRunning(false);
        clear();
      };

      return (
        <div style={style}>
          <BusinessCard
            style={{
              backgroundColor: isRunning ? "#fff3e0" : "#e3f2fd",
            }}
            description={message}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <Button onClick={handleStart} label="Start" />
            <Button
              onClick={handlePause}
              disabled={!isRunning}
              style={{
                cursor: !isRunning ? "not-allowed" : "pointer",
              }}
              label="Pause"
            />
            <Button onClick={handleClear} label="Clear" />
          </div>
        </div>
      );
    };

    return <UseTimeoutExample />;
  },
};

// ============================
// useOutsideClick
// ============================

export const UseOutsideClickExample: StoryObj = {
  render: () => {
    const UseOutsideClickExample = () => {
      const [isOpen, setIsOpen] = useState(false);

      const buttonRef = useRef<HTMLButtonElement>(null);
      const triggerRef = useRef<HTMLButtonElement>(null);
      const dropdownRef = useOutsideClick<HTMLDivElement>(() => {
        setIsOpen(false);
      }, [buttonRef, triggerRef]);

      return (
        <div style={style}>
          <Button ref={triggerRef} onClick={() => setIsOpen(!isOpen)} label="Toggle" />
          <Button variant="info" ref={buttonRef} label="Excluded Another Action" />
          {isOpen && <BusinessCard ref={dropdownRef} title="Example Title" outline description="Example description" />}
        </div>
      );
    };

    return <UseOutsideClickExample />;
  },
};
