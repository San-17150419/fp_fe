import {
  FocusEventHandler,
  FormEvent,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  useState,
} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  children?: ReactNode;
  name: string;
}

// Default type is text. name is required. Be default, id is the same as name when not provided.
export default function Input({
  type = "text",
  name,
  children,
  placeholder,
  ...props
}: InputProps) {
  const [labelMessage, setLabelMessage] = useState(placeholder);
  const [inputValue, setInputValue] = useState("");
  const [displayMessage, setDisplayMessage] = useState("");
  const [isMessageLegal, setIsMessageLegal] = useState(false);
  // TODO: Maybe I can create a custom hook for the display message.
  // TODO: The eye icon for toggle password visibility is not working properly. It will show up on first focus. But it will disappear after loosing focus and never show again. It is provided by the browser. I might need to make a custom one. (https://github.com/processing/p5.js-web-editor/issues/2533)
  //TODO: Create a tooltip of some sort for displaying details about the requirments of the input. I prefer to have a concise verification message. (So it won't disrrupt the layout and user experience)

  const handleOnChange = (e: FormEvent<HTMLInputElement>) => {
    const currentInput = e.currentTarget.value.trim();
    setInputValue(currentInput);
    if (currentInput === "") return;
    if (type === "text") {
      if (currentInput.length < 3) {
        setDisplayMessage("請輸入至少3個字");
        setIsMessageLegal(false);
      } else {
        setDisplayMessage("Good!");
        setIsMessageLegal(true);
      }
    }

    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      //   ^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$
      if (!emailRegex.test(currentInput)) {
        setDisplayMessage("請輸入正確的email");
        setIsMessageLegal(false);
      } else {
        setDisplayMessage("Good!");
        setIsMessageLegal(true);
      }
    }

    if (type === "password") {
      // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-_])[A-Za-z\d@$!%*?&-_]{8,}$/;

      if (!passwordRegex.test(currentInput)) {
        setDisplayMessage(
          "請輸入有效的密碼: 最少8個字符，至少1個大寫字母，1個小寫字母，1個數字和1個特殊字符",
        );
        setIsMessageLegal(false);
      } else {
        setDisplayMessage("Good!");
        setIsMessageLegal(true);
      }
    }
  };

  const handleOnBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    if (inputValue !== "") setLabelMessage("");
  };

  const handleOnFocus: FocusEventHandler<HTMLInputElement> = (e) => {
    setLabelMessage(placeholder);
  };

  return (
    <div className="relative m-1 flex h-[38px] w-[180px] flex-col gap-2">
      <input
        type={type}
        name={name}
        id={props.id ? props.id : name}
        className="peer h-full w-full cursor-pointer rounded-md border border-gray-300 p-2 text-slate-600 focus:border-blue-500 focus:outline-none"
        value={inputValue}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
        {...props}
      />
      <label
        htmlFor={name}
        className={`absolute left-2 top-[5px] cursor-pointer text-slate-400 transition-all peer-placeholder-shown:text-gray-500 peer-focus:-top-7 peer-focus:z-20 peer-focus:text-gray-500`}
      >
        {labelMessage}
      </label>
      <p
        className={`${
          isMessageLegal ? "text-green-500" : "text-red-500"
        } relative bottom-1 text-wrap text-sm`}
      >
        {displayMessage}
      </p>
    </div>
  );
}

Input.Label = InputLabel;

interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children?: ReactNode;
}

function InputLabel({ children, ...props }: InputLabelProps) {
  return <label {...props}>{children}</label>;
}
