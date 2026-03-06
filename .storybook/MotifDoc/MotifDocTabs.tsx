import { DocumentTabs } from "./types";

type Props = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export const MotifDocTabs = ({ activeTab, onTabChange }: Props) => {
  return (
    <div className="mtfDoc-tab-header">
      {DocumentTabs.map(({ id, label }) => (
        <button key={id} onClick={() => onTabChange(id)} className={`mtfDoc-tab--button ${activeTab === id ? "active" : ""}`.trim()}>
          {label}
        </button>
      ))}
    </div>
  );
};
