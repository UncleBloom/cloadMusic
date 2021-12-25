import axios from 'axios';
import React from 'react'
import './Login.css'
class Login extends React.Component<any,any>{
    constructor(props:any){
        super(props);
        this.state={
            phone:'',
            pw:'',
            capt:'',
            d1:'none',
            d2:'block',
            b1:'disabled',
        }
    }
    changePhone = (e: any) =>{
        let phone = e.target.value;
        this.setState({
            phone:phone
        })
        console.log(this.state.phone)
    }
    changePw = (e: any) =>{
        let pw = e.target.value;
        this.setState({
            pw:pw
        })
        console.log(this.state.pw)
    }
    changeCapt = (e: any) =>{
        let capt = e.target.value;
        this.setState({
            capt:capt
        })
        console.log(this.state.phone)
    }
    changed = (e: any) =>{
        if(this.state.d1 === 'none'){
            this.setState({
                d1: 'block',
                d2: 'none'
            })
        }
        else{
            this.setState({
                d1: 'none',
                d2: 'block'
            })
        }
    }
    submit1 = (e: any) =>{
        axios.post('http://101.33.207.151:3000/cellphone/existence/check',{
            phone:this.state.phone
        })
        .then(res=>{
            console.log(res);
            if(res.data.exist === 1){
                axios.post('http://101.33.207.151:3000/captcha/sent',{
                    phone:this.state.phone
                })
                .then(res=>{
                    console.log(res);
                })
            }
        })
    }
    submit2 = (e:any) =>{
        axios.post('http://101.33.207.151:3000/login/cellphone',{
            phone:this.state.phone,
            password:this.state.pw,
            captcha:this.state.capt
        })
        .then(res=>{
            console.log(res);
            localStorage.setItem('cookie',encodeURIComponent(res.data.cookie));
        })
    }
    checklog = (e:any) =>{
        let cookie = localStorage.getItem('cookie');
        console.log(cookie);
        let url = 'http://101.33.207.151:3000/login/status?cookie='+cookie;
        axios.get(url,{
            
        })
        .then(res=>{
            console.log(res)
        })
    }
    render(){
        return(
            <div className={'login-wrap'}>
                <div className={'login-top'}>
                    <div>手机号登录</div>
                </div>
                <div className={'login-info-wrap'}>
                    <div className={'login-info'}>
                        <div className={'u-phone-wrap'}>
                            <div>
                                <a className={'current'}>
                                    <span>+86</span>
                                </a>
                            </div>
                            <div className='u-phone-text'>
                                <input type="text" className={'u-phone'} placeholder='请输入手机号' value={this.state.phone} onChange={this.changePhone}></input>
                            </div>
                        </div>
                        <div className={'u-pw-wrap'} style={{display:this.state.d1}}>
                            <input type="password" className={'u-pw'} placeholder='设置登录密码，不少于8位' value={this.state.pw} onChange={this.changePw}></input>
                        </div>
                        <div>
                            <div className={'login-captcha-wrap'} style={{display:this.state.d2}}>
                                <input type='text' placeholder='请输入验证码' className={'login-captcha-text'} value={this.state.capt} onChange={this.changeCapt}/>
                                <button className={'login-captcha-get'} onClick={this.submit1}>获取验证码</button>
                            </div>
                        </div>
                        <div className={'login-actionbox'}>
                            <a className={'captcha-pw'} onClick={this.changed} href='#'>密码登录</a>
                            <label className='login-auto'>
                                <input type='checkbox' className={'login-auto-checkbox'} />
                                自动登录
                            </label>
                        </div>
                        <div className={'login-next-wrap'}>
                            <button className={'login-next'}  onClick={this.submit2}>登录</button>
                        </div>
                    </div>
                </div>
                <div className={'login-back-wrap'}>
                    <a className={'login-back'} onClick={this.checklog}>其他登录方式</a>
                    <a className={'login-register'}>没有账号？免费注册</a>
                </div>
            </div>
        )
    }
}

export default Login;