import tw, { styled } from "twin.macro";

type ButtonProps = {
  varian?: "primary" | "cancel" | "submit";
  hasHover?: boolean;
};

const ModalButton = styled.button(
  ({ varian = "primary", hasHover }: ButtonProps) => [
    tw`mt-5 ml-5 border-2 border-blue-500 px-4 py-2`,
    varian === "cancel" && tw`bg-red-500 hover:ring-red-300`,
    varian === "submit" && tw`bg-blue-500 hover:ring-blue-300`,
    varian === "primary" && tw`bg-gray-500 hover:ring-gray-300`,
    hasHover && tw`hover:border-red-500`,
  ],
);

export default ModalButton;
