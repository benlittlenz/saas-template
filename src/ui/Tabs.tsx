import * as TabsPrimitive from "@radix-ui/react-tabs";
import cx from "classnames";
import React from "react";

interface Tab {
  title: string;
  value: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs = ({ tabs }: TabsProps) => {
  const [activeTab, setActiveTab] = React.useState(tabs[0]?.value);

  return (
    <TabsPrimitive.Root
      className="mb-4"
      defaultValue={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsPrimitive.List className="flex flex-wrap  gap-x-4 w-full -mb-px">
        {tabs.map(({ title, value }) => (
          <TabsPrimitive.Trigger
            key={`tab-trigger-${value}`}
            value={value}
            className={cx(
              "inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-4 px-4 text-sm font-medium text-center border-transparent border-b-2",
              activeTab === value &&
                "border-neutral-500 hover:border-neutral-500",
            )}
          >
            {title}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {tabs.map(({ value, content }) => (
        <TabsPrimitive.Content key={`tab-content-${value}`} value={value}>
          {content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
};

export default Tabs;
