import tw, { styled } from "twin.macro";

type TdProps = {
  key?: string;
  children?: React.ReactNode;
  hasHover?: boolean;
};

// const Td = ({ key, children, hasHover }: TdProps) => (
//   <td key={key} css="border border-gray-400 p-2" hasHover>
//     {children}
//   </td>
// );

const Td = styled.td`
  ${tw`border border-gray-400 p-2`}
  ${({ hasHover }: TdProps) => hasHover && tw`hover:bg-gray-500`}
`;

export default ({ children }: TdProps) => <Td hasHover> {children}</Td>;
