import "./Search.scss";
import {useState} from "react";

function Search() {
  const [inputContent, setInputContent] = useState<string>("");

  return (
      <div className = "Search">
        <div className = "iconfont searchIcon">&#xe622;</div>
        <input type = "text" value = {inputContent} onChange = {(event) => {
          setInputContent(event.target.value)
        }} />
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