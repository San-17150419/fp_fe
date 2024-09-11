import Input from "../Components/modd/Input/InputWithVerification";
export default function InputPage() {
  return (
    <>
      <div className="flex flex-wrap gap-4">
        <Input
          type="email"
          autoComplete="off"
          name="email"
          placeholder="email"
        />
        <Input
          type="password"
          required
          name="password"
          placeholder="password"
        />
        <Input name="請輸入文字" placeholder="請輸入文字" />
      </div>
    </>
  );
}
