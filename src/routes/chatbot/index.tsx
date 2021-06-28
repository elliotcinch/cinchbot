import { FunctionalComponent, h } from "preact";
import { useForm, SubmitHandler } from "react-hook-form";
import { useLayoutEffect, useRef, useState } from "preact/hooks";
import { v4 as uuidv4 } from "uuid";
import cn from "classnames";
import style from "./style.css";
import { postData } from "../../utils/postData";
import { handleClassnames } from "../../utils/handleClassnames";
import { timeout } from "../../utils/timeout";
import { random } from "../../utils/random";
import Loading from "../../components/loading/loading";

interface FormInputs {
  userMessage: string;
}

export interface Message {
  response: string;
  fromBot: boolean;
  id: string;
}

const ENDPOINT =
  "https://f320r1axq5.execute-api.eu-west-1.amazonaws.com/dev/chat";

const DEFAULTSTATE: Message[] = [
  {
    response: "Hi, welcome to cinchBot 3000!",
    fromBot: true,
    id: `${uuidv4()}`,
  },
  {
    response:
      "You can ask me anything, such as 'Who do you work with to provide cinchCare?'",
    fromBot: true,
    id: `${uuidv4()}`,
  },
];

const Chatbot: FunctionalComponent = () => {
  const [messages, setMessages] = useState<Message[]>(DEFAULTSTATE);
  const [isFetching, setIsFetching] = useState(false);
  const ref = useRef<HTMLElement>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm<FormInputs>({
    mode: "onChange",
  });

  useLayoutEffect(() => {
    // do side effects
    if (ref.current) {
      const eleHeight = ref.current.scrollHeight;
      ref.current.scrollTo({ top: eleHeight });
    }
    // return () => /* cleanup */
  }, [messages]);

  const onSubmit: SubmitHandler<FormInputs> = async ({ userMessage }) => {
    setMessages((prevState) => [
      ...prevState,
      {
        response: userMessage,
        id: `${uuidv4()}`,
        fromBot: false,
      },
    ]);
    setValue("userMessage", "", { shouldValidate: true });
    setIsFetching(true);
    await postData(ENDPOINT, {
      text: userMessage,
      botUserId: `${uuidv4()}`,
    })
      .then(async (resp: Message) => {
        const randomWait = random(4, 8) * 10;
        await timeout(randomWait);
        setIsFetching(false);
        setMessages((prevState) => [
          ...prevState,
          { ...resp, id: `${uuidv4()}` },
        ]);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div class={style.container}>
      <header class={style.header}>
        <svg
          preserveAspectRatio="xMidYMid"
          height="30"
          width="75"
          fill="currentColor"
          viewBox="0 0 779.86 272.43"
        >
          <path
            fill="#57e8fc"
            d="M202.66 82.95c-22.87 0-41.47-18.6-41.47-41.47S179.79 0 202.66 0s41.47 18.6 41.47 41.47-18.6 41.48-41.47 41.48zm0-68.39c-14.84 0-26.91 12.07-26.91 26.91s12.07 26.91 26.91 26.91 26.91-12.07 26.91-26.91-12.07-26.91-26.91-26.91z"
          />
          <path d="M562.18 209.86a51.9 51.9 0 01-42.01 21.43c-28.64 0-51.95-23.3-51.95-51.95s23.3-51.95 51.95-51.95a51.9 51.9 0 0142.01 21.43l31.61-26.38a92.97 92.97 0 00-73.62-36.19c-51.33 0-93.08 41.76-93.08 93.08s41.76 93.09 93.08 93.09a92.97 92.97 0 0073.62-36.19l-31.61-26.37zm-427.08 0a51.9 51.9 0 01-42.01 21.43c-28.64 0-51.95-23.3-51.95-51.95s23.31-51.95 51.95-51.95a51.9 51.9 0 0142.01 21.43l31.61-26.38a92.97 92.97 0 00-73.62-36.19C41.76 86.26 0 128.02 0 179.35s41.76 93.08 93.09 93.08a92.97 92.97 0 0073.62-36.19l-31.61-26.38zm46.99-109.36h41.13v168.8h-41.13zm230.55 168.8H371.5v-95.97c0-6.38-.91-18.44-7.02-27.61-6.82-10.23-19.15-15.2-37.71-15.2-19.09 0-31.9 6.54-38.09 15.2-5.96 8.33-6.64 18.82-6.64 27.61v95.97H240.9v-95.97c0-14.44 1.48-35.72 14.31-53.67 14.35-20.09 38.43-30.27 71.56-30.27 22.62 0 53.47 5.82 71.94 33.52 11.51 17.27 13.93 36.96 13.93 50.42v95.97zm353.29-146.39c-18.47-27.71-49.32-33.52-71.94-33.52-17.46 0-32.4 2.83-44.73 8.45V51.17h-41.14V269.3h41.14v-95.97c0-8.78.69-19.28 6.64-27.61 6.19-8.66 19-15.2 38.09-15.2 18.56 0 30.89 4.97 37.71 15.2 6.11 9.17 7.02 21.23 7.02 27.61v95.97h41.14v-95.97c0-13.46-2.42-33.15-13.93-50.42z" />
        </svg>
      </header>
      <section class={style.messages} ref={ref}>
        {messages.map((message, index) => {
          const messageClass = handleClassnames(messages, message, index);
          return (
            <div key={message.id} class={style.messageContainer}>
              {message.fromBot && (
                <div class={style.avatar}>
                  <img src={"assets/images/rylan.jpg"} alt="" />
                </div>
              )}
              <article
                class={cn(
                  [style.message, messageClass && style[messageClass]],
                  {
                    [style.fromBot]: message.fromBot,
                    [style.fromUser]: !message.fromBot,
                  }
                )}
              >
                {message.response}
              </article>
              {!message.fromBot && (
                <svg
                  width="37"
                  height="37"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.822 34.656c8.745 0 15.834-7.09 15.834-15.834 0-8.745-7.09-15.835-15.834-15.835-8.745 0-15.835 7.09-15.835 15.835 0 8.745 7.09 15.834 15.835 15.834z"
                    fill="#311C77"
                  />
                  <path
                    d="M18.49 20.25a5.278 5.278 0 100-10.556 5.278 5.278 0 000 10.556zM28.815 30.713a11.146 11.146 0 00-16.542-5.05 11.146 11.146 0 00-4.104 5.042"
                    stroke="#fff"
                    stroke-width="2.438"
                  />
                  <path
                    d="M18.49 34.325c8.746 0 15.835-7.089 15.835-15.834S27.236 2.656 18.491 2.656 2.656 9.746 2.656 18.491c0 8.745 7.09 15.834 15.835 15.834z"
                    stroke="#57E8FC"
                    stroke-width="3.656"
                  />
                </svg>
              )}
            </div>
          );
        })}
        {isFetching && (
          <div class={style.messageContainer}>
            <div class={style.avatar}>
              <img src={"assets/images/rylan.jpg"} alt="" />
            </div>
            <Loading />
          </div>
        )}
      </section>
      <div class={style.formContainer}>
        <form class={style.form} onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("userMessage", {
              required: true,
              validate: (value) => value.length > 0,
            })}
            type="text"
            placeholder="Ask me anything!"
          />
          <input type="submit" value={"Send"} disabled={!isValid} />
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
