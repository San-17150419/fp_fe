export type FactoryLogPreData = {
  preData: PreData;
};
// export type FactoryLogPreData = {
//   preData: {
//     factory: GenericObject;
//     point: GenericObject;
//     date_type: GenericObject;
//     dep: { [key: string]: GenericObject };
//   };
// };

export type PostDataParams = {
  factory: "GD" | "HP" | "DL";
  date_type: "half-year" | "quarter";
  date_start: string;
  // right now, we do not need to specify point. I only include it for completeness
  point: "ar" | "pamt_h";
};

export type LogData = {
  dep: string;
  data: Array<{
    date_start: string;
    date_end: string;
    raw: RawData[];
  }>;
};

export type FactoryLogRawData = {
  data: LogData[];
  dep: string;
  duration: Array<{ date_start: string; date_end: string }>;
  post: {
    factory: Factory;
    date_type: "half-year" | "quarter";
    date_start: string;
    point: "ar" | "pamt_p" | null;
  };
};
// export type FactoryLogRawData<F extends Factory> = {
//   data: LogData<F>[];
//   dep: DepartmentDictionary<F>;
//   duration: Array<{ date_start: string; date_end: string }>;
//   post: {
//     factory: Factory;
//     date_type: "half-year" | "quarter";
//     date_start: string;
//     point: "ar" | "pamt_p" | null;
//   };
// };

// export type FormattedData<F extends Factory> = {
//   [K in DepartmentDictionary<F> as string]: {
//     [sys: string]: {
//       [p in Point]: number[];
//     };
//   };
// };

export type Factory = "GD" | "HP" | "DL";

export type Point =
  | "ar"
  | "pamt_p"
  | "pamt_h"
  | "wt"
  | "vt"
  | "sd"
  | "pamt"
  | "cpamt";

export type DateType = "half-year" | "quarter";

// export type DepartmentDictionary<F extends Factory> = {
//   [D in Department<F>]: string;
// };

// export type DepartmentsForFactory<F extends Factory> = DepartmentMap[F];
export type GD_Departments =
  | "INJ"
  | "CE"
  | "MECH"
  | "T1"
  | "T2"
  | "A89"
  | "F99";
export type HP_Departments =
  | "INJ"
  | "D09"
  | "OEM"
  | "CE"
  | "MECH"
  | "T1"
  | "T2"
  | "T3";
export type DL_Departments = "INJ" | "MECH" | "ASM";
export type DepartmentMap = {
  GD: GD_Departments;
  HP: HP_Departments;
  DL: DL_Departments;
};

export type Department<F extends Factory> = DepartmentMap[F];

export type PreData = {
  factory: { [key in Factory]: string };
  point: Partial<{ [key in Point]: string }>;
  date_type: { [key in DateType]: string };
  dep: {
    [F in Factory]: { [D in Department<F>]: string };
  };
};

export type RawData = Partial<{ [key in Point]: number }> & { ar: number } & {
  pamt_p: number;
} & { sys: string } & { pl: string };

export type FactoryEventReponse = {
  post: FactoryEventResponsePostData;
  data: FactoryEventResponseData[];
  data_mold: FactoryEventReponseMoldData[];
};

export type FactoryEventResponsePostData = {
  factory: Factory;
  department: string;
  sys: string;
  date_start: string;
  date_end: string;
};

export type FactoryEventResponseData = {
  pl: string;
  sys: string;
  prod_name: string;
  pamt: number;
  wt: number;
  cpamt: number;
  pamt_h: number;
  ar: number;
};

export type FactoryEventReponseMoldData = {
  ar: number;
  count_repaired: number;
  cpamt: number;
  mamt: number;
  pamt: number;
  pamt_h: number;
  pl: string;
  sn_num: string;
  sys: string;
  wt: number;
};

export type FactoryLogPreFilterState = {
  selectedFactory: "GD" | "HP" | "DL";
  selectedDateType: "half-year" | "quarter";
  selectedPoint: "ar" | "pamt_p";
  dateStart: string;
  progress: number;
  isLoading: boolean;
  factoryLogRawData: FactoryLogRawData | null;
  preData: PreData;
};

export type FactoryLogPreFilterAction =
  | {
      type: "setSelectedFactory";
      payload: FactoryLogPreFilterState["selectedFactory"];
    }
  | {
      type: "setSelectedDateType";
      payload: FactoryLogPreFilterState["selectedDateType"];
    }
  | {
      type: "setSelectedPoint";
      payload: FactoryLogPreFilterState["selectedPoint"];
    }
  | {
      type: "setDateStart";
      payload: FactoryLogPreFilterState["dateStart"];
    }
  | {
      type: "setIsLoading";
      payload: FactoryLogPreFilterState["isLoading"];
    }
  | {
      type: "setFactoryLogRawData";
      payload: FactoryLogPreFilterState["factoryLogRawData"];
    };

export type FactoryLogPreFilterProps = {
  preData: PreData;
};

export type Duration = {
  date_start: string;
  date_end: string;
};

export type FactoryTableData = {
  data: Record<string, any>;
  duration: Duration[];
  factory: Factory;
  point: "ar" | "pamt_h";
};
