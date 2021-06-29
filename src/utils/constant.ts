import { Message } from "../routes/chatbot";
import { v4 as uuidv4 } from "uuid";

export const ENDPOINT =
  "https://f320r1axq5.execute-api.eu-west-1.amazonaws.com/dev/chat";

export const DEFAULTSTATE: Message[] = [
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
