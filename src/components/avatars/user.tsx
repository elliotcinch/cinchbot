import { FunctionalComponent, h } from "preact";
import style from "./avatar.css";

const UserAvatar: FunctionalComponent = () => {
  return (
    <div class={style.avatar}>
      <img src={"assets/images/rylan.jpg"} alt="" />
    </div>
  );
};

export default UserAvatar;
