import { FunctionalComponent, h } from "preact";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRef, useState } from "preact/hooks";
import { v4 as uuidv4 } from "uuid";
import cn from "classnames";
import style from "./style.css";
import { postData } from "../../utils/postData";
import { handleClassnames } from "../../utils/handleClassnames";
import { timeout } from "../../utils/timeout";
import { random } from "../../utils/random";
import Loading from "../../components/loading/loading";
import Header from "../../components/header/header";
import { DEFAULTSTATE, ENDPOINT } from "../../utils/constant";
import UserAvatar from "../../components/avatars/user";
import BotAvatar from "../../components/avatars/bot";

interface FormInputs {
  userMessage: string;
}

export interface Message {
  response: string;
  fromBot: boolean;
  id: string;
}

const botUserId = `${uuidv4()}`;

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
      botUserId,
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
      <Header />
      <section class={style.messages} ref={ref}>
        {messages.map((message, index) => {
          const messageClass = handleClassnames(messages, message, index);
          return (
            <div key={message.id} class={style.messageContainer}>
              {message.fromBot && <BotAvatar />}
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
              {!message.fromBot && <UserAvatar />}
            </div>
          );
        })}
        {isFetching && (
          <div class={style.messageContainer}>
            <BotAvatar />
            <Loading />
          </div>
        )}
      </section>
      <div class={style.formContainer}>
        {/* @ts-ignore */}
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
