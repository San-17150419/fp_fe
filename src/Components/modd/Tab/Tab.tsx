import {
  Tab as HeadlessUITab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { motion } from "framer-motion";

function Tab() {
  return (
    <TabGroup
      defaultIndex={1}
      className="flex h-full w-full flex-col gap-2 rounded bg-black p-2"
    >
      <TabList className={"flex gap-2"}>
        <HeadlessUITab
          className={
            "m-w flex-1 rounded-t-2xl bg-gray-400 p-2 text-black transition-all duration-100 hover:text-gray-200 data-[hover]:bg-gray-600 data-[selected]:bg-gray-700 data-[selected]:text-gray-100"
          }
        >
          Tab 1
        </HeadlessUITab>
        <HeadlessUITab
          className={
            "m-w flex-1 rounded-t-2xl bg-gray-400 p-2 text-black transition-all duration-100 hover:text-gray-200 data-[hover]:bg-gray-600 data-[selected]:bg-gray-700 data-[selected]:text-gray-100"
          }
        >
          Tab 2
        </HeadlessUITab>
        <HeadlessUITab
          className={
            "m-w flex-1 rounded-t-2xl bg-gray-400 p-2 text-black transition-all duration-100 hover:text-gray-200 data-[hover]:bg-gray-600 data-[selected]:bg-gray-700 data-[selected]:text-gray-100"
          }
        >
          Tab 3
        </HeadlessUITab>
      </TabList>
      <TabPanels className="h-full min-h-40 rounded border border-white p-4 text-white">
        <TabPanel>Type 1</TabPanel>
        <TabPanel>Type 2</TabPanel>
        <TabPanel>Type 3</TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
export default Tab;
