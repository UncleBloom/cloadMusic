import axios from "axios";
import React from "react";
import "./Login.css";
class Login extends React.Component<any, any> {
  timer: number = 0;
  constructor(props: any) {
    super(props);
    this.state = {
      phone: "",
      pw: "",
      capt: "",
      d1: "none",
      d2: "block",
      b1: "disabled",
      btnText: "发送验证码",
      btnBool: true,
      loginway: "密码登录",
    };
  }
  changePhone = (e: any) => {
    let phone = e.target.value;
    this.setState({
      phone: phone,
    });
    if (phone.length === 11) {
      this.setState({
        btnBool: false,
      });
    } else {
      this.setState({
        btnBool: true,
      });
    }
    // console.log(this.state.phone);
  };
  changePw = (e: any) => {
    let pw = e.target.value;
    this.setState({
      pw: pw,
    });
    // console.log(this.state.pw);
  };
  changeCapt = (e: any) => {
    let capt = e.target.value;
    this.setState({
      capt: capt,
    });
    // console.log(this.state.phone);
  };
  changed = () => {
    if (this.state.d1 === "none") {
      this.setState({
        d1: "block",
        d2: "none",
        loginway: "验证码登录",
      });
    } else {
      this.setState({
        d1: "none",
        d2: "block",
        loginway: "密码登录",
      });
    }
  };
  sendCode() {
    let maxTime = 60;
    this.timer = setInterval(() => {
      if (maxTime > 0) {
        --maxTime;
        this.setState({
          btnText: maxTime + "s",
          btnBool: true,
        });
      } else {
        this.setState({
          btnText: "发送验证码",
          btnBool: false,
        });
        clearInterval(this.timer);
      }
    }, 1000);
    axios
      .post("http://101.33.207.151:3000/captcha/sent", {
        phone: this.state.phone,
      })
      .then((res) => {
        // console.log(res);
      });
  }
  login = (): boolean => {
    let flag = true;
    axios
      .post("http://101.33.207.151:3000/login/cellphone", {
        phone: this.state.phone,
        password: this.state.pw,
        captcha: this.state.capt,
      })
      .then(
        (res) => {
          //   console.log(res);
          if (res.data.code === 502) {
            alert("密码错误");
            flag = false;
          } else {
            localStorage.setItem("cookie", encodeURIComponent(res.data.cookie));
            flag = true;
          }
        },
        (err) => {
          console.log(err);
          alert("验证码错误");
          flag = false;
        }
      );
    return flag;
  };
  submit1 = () => {
    axios
      .post("http://101.33.207.151:3000/cellphone/existence/check", {
        phone: this.state.phone,
      })
      .then((res) => {
        // console.log(res);
        if (res.data.exist === 1) {
          this.sendCode();
        } else {
          alert("当前手机号未注册");
        }
      });
  };
  submit2 = async (): Promise<boolean> => {
    let flag: boolean = false;
    let phone = this.state.phone;
    let pw = this.state.pw;
    let capt = this.state.capt;
    if (phone.length !== 11) {
      alert("请正确填写手机号码");
      return false;
    } else if (this.state.d1 === "block" && (pw.length < 8 || pw.length > 20)) {
      alert("请正确填写密码");
      return false;
    } else if (this.state.d2 === "block" && capt.length !== 4) {
      alert("请正确填写验证码");
      return false;
    } else {
      const res = await axios.post(
        "http://101.33.207.151:3000/cellphone/existence/check",
        {
          phone: this.state.phone,
        }
      );
      if (res.data.exist === 1) {
        flag = this.login();
        if (flag) {
          setTimeout(() => {
            window.location.hash = "/";
            window.location.reload();
            document
              .querySelector(".login-shelter")
              ?.setAttribute("class", "login-shelter hide");
          }, 0);
        }
        // console.log(flag);
      } else {
        alert("当前手机号未注册");
        flag = false;
      }
    }
    // console.log(flag);

    return flag;
  };
  checklog = () => {
    let cookie = localStorage.getItem("cookie");
    // console.log(cookie);
    let url = "http://101.33.207.151:3000/login/status?cookie=" + cookie;
    axios.get(url, {}).then((res) => {
      //   console.log(res);
    });
  };
  render() {
    return (
      <div className="login-shelter hide">
        <div className={"login-wrap"}>
          <div className={"login-top"}>
            <div>手机号登录</div>
            <span
              className="iconfont"
              onClick={() => {
                document
                  .querySelector(".login-shelter")
                  ?.setAttribute("class", "login-shelter hide");
              }}
            >
              &#xe669;
            </span>
          </div>
          <div className={"login-info-wrap"}>
            <div className={"login-info"}>
              <div className={"u-phone-wrap"}>
                <div>
                  <a className={"current"}>
                    <span>+86</span>
                  </a>
                </div>
                <div className="u-phone-text">
                  <input
                    type="text"
                    className={"u-phone"}
                    placeholder="请输入手机号"
                    value={this.state.phone}
                    onChange={this.changePhone}
                  ></input>
                </div>
              </div>
              <div className={"u-pw-wrap"} style={{ display: this.state.d1 }}>
                <input
                  type="password"
                  className={"u-pw"}
                  placeholder="设置登录密码，不少于8位"
                  value={this.state.pw}
                  onChange={this.changePw}
                ></input>
              </div>
              <div>
                <div
                  className={"login-captcha-wrap"}
                  style={{ display: this.state.d2 }}
                >
                  <input
                    type="text"
                    placeholder="请输入验证码"
                    className={"login-captcha-text"}
                    value={this.state.capt}
                    onChange={this.changeCapt}
                  />
                  <button
                    className={"login-captcha-get"}
                    onClick={this.submit1}
                    disabled={this.state.btnBool}
                  >
                    {this.state.btnText}
                  </button>
                </div>
              </div>
              <div className={"login-actionbox"}>
                <a className={"captcha-pw"} onClick={this.changed} href="#">
                  {this.state.loginway}
                </a>
                <label className="login-auto">
                  <input type="checkbox" className={"login-auto-checkbox"} />
                  自动登录
                </label>
              </div>
              <div className={"login-next-wrap"}>
                <button
                  className={"login-next"}
                  onClick={() => {
                    this.submit2();
                    // console.log(flag);

                    // console.log(flag);

                    // let cookie = localStorage.getItem("cookie");
                    // console.log(cookie);
                    // let url =
                    //   "http://101.33.207.151:3000/login/status?cookie=" +
                    //   cookie;
                    // axios.get(url, {}).then((res) => {
                    // });
                  }}
                >
                  登录
                </button>
              </div>
            </div>
          </div>
          <div className={"login-back-wrap"}>
            <a className={"login-back"} onClick={this.checklog} href="#">
              其他登录方式
            </a>
            <a className={"login-register"} href="#">
              没有账号？免费注册
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
