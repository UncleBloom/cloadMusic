import React, { Component, useContext, useEffect, useState } from "react";
import ReactDOM, { render } from "react-dom";
// import { Text } from "react-native";

interface IChangeWordColorProps {
  str: string;
  word: string;
}

interface IChangeWordColorState {
  words: string[];
}

function doColor(props: IChangeWordColorProps): string[] {
  let contentArr = new Array<string>();
  if (props.word) {
    let str = props.str.replace(
      `${props.word}`,
      `<^replace$>${props.word}<^replace$>`
    );
    contentArr = [...str.split("<^replace$>")];
    return contentArr;
  }
  return [];
}

function ChangeWordColor(props: IChangeWordColorProps) {
  const [words, setWords] = useState<string[]>();
  // console.log(props.str);

  useEffect(() => {
    setWords(doColor({ str: props.str, word: props.word }));
    // console.log(1);
  }, [props.str]);

  return (
    <span>
      {words
        ? words.map((item, index) => {
            // remindUser列表中的标记蓝色
            if (props.word === item) {
              return (
                <span style={{ color: "blue" }} key={index}>
                  {item}
                </span>
              );
            }

            // item可能为空字符串，不会展示，无妨碍
            return <span key={index}>{item}</span>;
          })
        : props.str}
    </span>
  );
}

export default ChangeWordColor;
