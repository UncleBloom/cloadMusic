import React, {useEffect, useState} from "react";
import "./BackTop.scss";

function BackTop() {
    const [show, switchShow] = useState(false); // 设置状态

    useEffect(() => {
        const listener = () => {
            switchShow(window.scrollY > 10);
        };
        document.addEventListener("scroll", listener);
        return () => document.removeEventListener("scroll", listener); // 组件销毁后，取消监听
    }, [show]);
    return (
        <div
            className={show ? "scroll-to-top" : "scroll-to-top  hide"}
            onClick={() => {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth",
                });
            }}
        >
            <span className="iconfont">&#xe66d;</span>
            <span>TOP</span>
        </div>
    );
}

export default BackTop;
