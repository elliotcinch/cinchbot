import { Message } from "../routes/chatbot";

export const handleClassnames = (
  messages: Message[],
  message: Message,
  index: number
): string | undefined => {
  const isBot = message.fromBot;
  const amountOfMessages = messages.length;
  const atStart = index === 0;
  const atEnd = index + 1 >= amountOfMessages;
  const prevMessageFromSameSender = !atStart
    ? message.fromBot === messages[index - 1].fromBot
    : false;
  const nextMessageFromSameSender = !atEnd
    ? message.fromBot === messages[index + 1].fromBot
    : false;
  if (!prevMessageFromSameSender && nextMessageFromSameSender) {
    return isBot ? "fromBotFirst" : "fromUserFirst";
  }
  if (prevMessageFromSameSender && nextMessageFromSameSender) {
    return isBot ? "fromBotMiddle" : "fromUserMiddle";
  }
  if (prevMessageFromSameSender && !nextMessageFromSameSender) {
    return isBot ? "fromBotEnd" : "fromUserEnd";
  }
};
