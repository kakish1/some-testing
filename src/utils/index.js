import { message } from "antd";

export const showMessage = (
  { content, type } = {
    content: "Добавьте что то сюда",
    type: "success",
  }
) => {
  message.open({ content, duration: 4, type });
};
