import {
  FocusEventHandler,
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  useState,
  useRef,
  useEffect,
} from "react";
import MessageBox from "./MessageBox";
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: "email" | "password" | "text";
  children?: ReactNode;
  name: string;
}

// Default type is text. name is required. Be default, id is the same as name when not provided.
export default function Input({
  type = "text",
  name,
  children,
  placeholder,
  autoComplete = "off",
  ...props
}: InputProps) {
  const [labelMessage, setLabelMessage] = useState(placeholder);
  const [inputValue, setInputValue] = useState("");
  const [displayMessage, setDisplayMessage] = useState("");
  const [isMessageLegal, setIsMessageLegal] = useState(false);
  const [labelWidth, setLabelWidth] = useState<string>("");
  // TODO: Maybe I can create a custom hook for the display message.
  // TODO: The eye icon for toggle password visibility is not working properly. It will show up on first focus. But it will disappear after loosing focus and never show again. It is provided by the browser. I might need to make a custom one. (https://github.com/processing/p5.js-web-editor/issues/2533)

  const DISPLAYMESSAGE = {
    text: "請輸入至少3個字",
    email: "請輸入正確的email",
    password:
      "請輸入有效的密碼: 最少8個字符，至少1個大寫字母，1個小寫字母，1個數字和1個特殊字符",
  };

  // Get input width so that the label can be positioned correctly.
  // When input element is not focused or clicked, the width of the label is the same as the input. Set text overflow to ellipsis so that the text message in label won't overflow. When the input is focused or clicked, the label won't have max width.
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateLabelWidth = () => {
      if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        const inputWidth = rect.width;
        setLabelWidth(`${inputWidth}px`);
      }
    };

    // Initial call to set the label width
    updateLabelWidth();

    // Event listener for window resize
    window.addEventListener("resize", updateLabelWidth);
    return () => window.removeEventListener("resize", updateLabelWidth);
  }, []);
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
          // "請輸入有效的密碼: 最少8個字符，至少1個大寫字母，1個小寫字母，1個數字和1個特殊字符",
          "密碼格式錯誤",
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
    <div className="relative mx-1 my-5 flex h-[38px] flex-col gap-2">
      <input
        type={type}
        name={name}
        id={name}
        ref={inputRef}
        className="peer h-full w-full hover:border-blue-300 cursor-pointer rounded-md border border-gray-300 p-1 text-sm text-slate-600 focus:border-blue-500 focus:outline-none tabletP:p-2"
        value={inputValue}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
        {...props}
      />
      <label
        htmlFor={name}
        className="absolute top-[7px] w-max cursor-pointer overflow-clip overflow-ellipsis text-nowrap px-1 text-sm text-slate-400 transition-all peer-placeholder-shown:text-gray-500 peer-focus:-top-5 peer-focus:z-20 peer-focus:text-gray-500 tabletP:top-[7px] tabletP:peer-focus:-top-7 lg:px-2 lg:text-base"
        style={{ maxWidth: labelWidth }}
      >
        {labelMessage}
      </label>
      <div className="absolute top-11 flex items-center gap-1">
        {!isMessageLegal && (
          <MessageBox displayMessage={DISPLAYMESSAGE[type]} />
        )}
        <p
          className={`${isMessageLegal ? "text-green-500" : "text-red-500"} ml-1 text-wrap text-xs`}
        >
          {displayMessage}
        </p>
      </div>
    </div>
  );
}
