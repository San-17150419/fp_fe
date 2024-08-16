import { GrSearch } from "react-icons/gr";
import FactoryBaseButton from "./FactoryBaseButton";

type FactorySearchButtonProps = {
  formId: string;
  title?: string;
  onClick?: () => void;
};
// This button is suppsed to be used in a form, so onClick is not required. As long as formId is provided, the button will submit the form
export default function FactorySearchButton({
  formId,
  title = "Search",
  onClick,
}: FactorySearchButtonProps) {
  return (
    <FactoryBaseButton
      onClick={onClick}
      title={title}
      type="submit"
      form={formId}
    >
      <GrSearch />
    </FactoryBaseButton>
  );
}
