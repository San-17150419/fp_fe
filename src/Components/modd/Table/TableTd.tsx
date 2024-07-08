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

export default function Td({ children }: TdProps) {
  return (
    <td className="text-nowrap border border-gray-400 p-2 text-center hover:bg-gray-500">
      {children}
    </td>
  );
}
