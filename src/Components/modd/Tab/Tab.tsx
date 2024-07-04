import {
  Tab as HeadlessUITab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";

function Tab() {
  return (
    <TabGroup
      defaultIndex={1}
      className={"m-2 flex flex-col gap-2 rounded bg-black p-2"}
    >
      <TabList className={"flex gap-2"}>
        <HeadlessUITab
          className={
            "m-w flex-1 rounded bg-gray-400 p-2 text-black data-[hover]:bg-gray-600 data-[selected]:bg-gray-500 data-[selected]:text-gray-100"
          }
        >
          Tab 1
        </HeadlessUITab>
        <HeadlessUITab
          className={
            "m-w flex-1 rounded bg-gray-400 p-2 text-black data-[hover]:bg-gray-600 data-[selected]:bg-gray-500 data-[selected]:text-gray-100"
          }
        >
          Tab 2
        </HeadlessUITab>
        <HeadlessUITab
          className={
            "m-w flex-1 rounded bg-gray-400 p-2 text-black data-[hover]:bg-gray-600 data-[selected]:bg-gray-500 data-[selected]:text-gray-100"
          }
        >
          Tab 3
        </HeadlessUITab>
      </TabList>
      <TabPanels className="min-h-40 rounded border border-white p-4 text-white">
        <TabPanel>Content 1</TabPanel>
        <TabPanel>Content 2</TabPanel>
        <TabPanel>Content 3</TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
export default Tab;
