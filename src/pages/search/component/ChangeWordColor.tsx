import React, { Component, useContext, useState } from "react";
import ReactDOM, { render } from "react-dom";
// import { Text } from "react-native";

interface IChangeWordColorProps {
  str: string;
  word: string;
}

interface IChangeWordColorState {
  words: string[];
}

class ChangeWordColor extends Component<
  IChangeWordColorProps,
  IChangeWordColorState
> {
  constructor(props: IChangeWordColorProps) {
    super(props);
    this.state = {
      words: [],
    };
  }

  doColor() {
    let contentArr;
    if (this.props.word) {
      let str = this.props.str.replace(
        `${this.props.word}`,
        `<^replace$>${this.props.word}<^replace$>`
      );
      contentArr = str.split("<^replace$>");
      this.setState({ words: contentArr });
    }
  }

  componentDidMount() {
    this.doColor();
  }
  // const content = '@周杰伦 你要注意这段歌词，@王力宏@方大同，你俩注意这段旋律';
  // const remindUsrs = [
  // {name:'周杰伦',code:'1'},
  // {name:'王力宏',code:'2'},
  // {name:'方大同',code:'3'}
  // ];
  //@人员列表存在，则将content根据@人员列表分裂成数组

  render() {
    return (
      <p>
        {this.state.words
          ? this.state.words.map((item, index) => {
              //remindUser列表中的标记蓝色
              if (this.props.word === item) {
                return <p style={{ color: "blue" }}>{item}</p>;
              }

              //item可能为空字符串，不会展示，无妨碍
              return <p>{item}</p>;
            })
          : this.props.str}
      </p>
    );
  }
}

export default ChangeWordColor;
