import ComboBox from "./ComboBox";
import Table from "./Table";
export default function PostFilterSkeleton() {
  const defaultValue = [{ text: "all", value: "all", id: "all" }];

  const onChange = () => {};

  return (
    <>
      <div className="h-10 flex-grow basis-[100px]">
        <ComboBox<String>
          options={defaultValue}
          onChange={onChange}
          name="模號"
        />
      </div>
      <div className="h-10 flex-grow basis-[100px]">
        <ComboBox<String>
          options={defaultValue}
          onChange={onChange}
          name="名版"
        />
      </div>
      <div className="h-10 flex-grow basis-[100px]">
        <ComboBox<String>
          options={defaultValue}
          onChange={onChange}
          name="模具唯一碼"
        />
      </div>
      <div className="h-10 flex-grow basis-[100px]">
        <Table data={[]} isLoading={true} visibleList={[]} />
      </div>
    </>
  );
}
