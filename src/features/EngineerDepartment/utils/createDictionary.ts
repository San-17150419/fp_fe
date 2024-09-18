import { MoldStatus, PnbState, type FilterData, type Site } from "../types";

export const createDictionary = (data: FilterData["data"]) => {
  const dictionary: {
    allData: {
      [key: string]: FilterData["data"][number];
    };
    moldNumToId: {
      [key: string]: Array<FilterData["data"][number]["sn_num"]>;
    };
    boardNameToId: {
      [key: string]: Array<FilterData["data"][number]["sn_num"]>;
    };
  } = { allData: {}, moldNumToId: {}, boardNameToId: {} };

  data.forEach((d) => {
    // create a dictionary that represents data in unfiltered form
    // TODO: review this later to see if it's justified. Right now, there are two copies of the same data. But I am not sure how complicated it will be to update state in postFilter if I only have one copy.
    // TODO: prod_name_board has two exceptions. The value is null. I need to consider this two cases.
    // Two ways to avoid having to consider all possible exceptions. 1. Aggregate all exceptions in one place. 2. In combobox, a special option for example "無資料" to represent no data. And this options will filter the data using key like null, undefined, empty string, etc. Not sure if this is safe though. I do know they would be converted to string when they are used as key in dictionary.
    if (!dictionary.boardNameToId["all"]) {
      dictionary.boardNameToId["all"] = [d.sn_num];
    } else {
      dictionary.boardNameToId["all"].push(d.sn_num);
    }

    if (!dictionary.moldNumToId["all"]) {
      dictionary.moldNumToId["all"] = [d.sn_num];
    } else {
      dictionary.moldNumToId["all"].push(d.sn_num);
    }

    // create a dictionary for all data. sn_num is the key
    // TODO: Need to refacotor type definition
    dictionary.allData[d.sn_num] = {
      ...d,
      site: d.site as Site,
      state: d.state as MoldStatus,
      pnb_state: d.pnb_state as PnbState,
      property_num: d.property_num as string, //TODO: consider cases where property_num is null
      spare: d.spare as string, //TODO: consider cases where spare is null
    };

    // Determine the key to use for mold_num
    const moldKey = d.mold_num || "無模號";

    // create a dictionary for mold_num. The value is an array of sn_num
    if (!dictionary.moldNumToId[moldKey]) {
      dictionary.moldNumToId[moldKey] = [d.sn_num];
    } else {
      dictionary.moldNumToId[moldKey].push(d.sn_num);
    }

    // create a dictionary for boardName. The value is an array of sn_num
    if (!dictionary.boardNameToId[d.prod_name_board]) {
      dictionary.boardNameToId[d.prod_name_board] = [d.sn_num];
    } else {
      dictionary.boardNameToId[d.prod_name_board].push(d.sn_num);
    }
  });

  return dictionary;
};
