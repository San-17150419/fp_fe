import { FactoryLogContextProvider } from "../Components/modd/Table/FactoryLog/FactoryLogContext";
import Container from "../Components/modd/Table/FactoryLog/Chart/Container";
export default function Chart() {
  return (
    <FactoryLogContextProvider>
      <Container />
    </FactoryLogContextProvider>
  );
}
