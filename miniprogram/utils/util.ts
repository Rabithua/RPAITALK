import { Message } from "./request";

export const formatTime = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join("/") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
};

const formatNumber = (n: number) => {
  const s = n.toString();
  return s[1] ? s : "0" + s;
};

export function fomatContent(talks: Message[]) {
  const CODE_BLOCK_REG = /```[\s\S]*?\n([\s\S]*?)\n```/g;
  const SHORT_CODE_BLOCK_REG = /`([\s\S]*?)`/g;
  return talks.map((talk: any) => ({
    ...talk,
    fomatContent: talk.fomatContent || talk.content
      .replace(CODE_BLOCK_REG, "<pre class='code' lang=''>$1</pre>")
      .replace(
        SHORT_CODE_BLOCK_REG,
        "<pre class='shortCode' lang=''>$1</pre>",
      ),
  }));
}

export function removeDoubleNewLine(talks: Message[]) {
  return talks.map((talk: any) => ({
    ...talk,
    content: talk.content.replace(/^\n\n/, ""),
    fomatContent: talk.fomatContent.replace(/^\n\n/, ""),
  }));
}
