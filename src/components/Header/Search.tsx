import "./Search.scss";
import {useState} from "react";

interface ISearchParams {
  launchRequestCallback: (content: string) => void; // 发起搜索请求(并更改路由)的回调函数
}

function Search(params: ISearchParams) {
  const [inputContent, setInputContent] = useState<string>("");

  const initiateSearchRequest = () => {
    params.launchRequestCallback(inputContent)
  }

  return (
      <div className = "Search">
        <div className = "iconfont searchIcon" onClick = {initiateSearchRequest}>&#xe622;</div>
        <input className = "input"
               type = "text"
               placeholder = "搜索"
               value = {inputContent}
               onChange = {(event) => {
                 setInputContent(event.target.value)
               }}
               onKeyDown = {(event) => {
                 if (event.key === "Enter") {
                   initiateSearchRequest();
                 }
               }}
        />
        <div className = "iconfont deleteIcon"
             style = {{visibility: inputContent === "" ? "hidden" : "visible"}}
             onClick = {() => {
               setInputContent("")
             }}
        >&#xe6d5;</div>
      </div>
  )
}

export default Search;