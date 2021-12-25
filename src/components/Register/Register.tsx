import React from 'react'
import './Register.css'
import axios from 'axios'

class Register extends React.Component<any,any>{
    constructor(props:any){
        super(props);
        this.state={
            phone:'',
            pw:'',
            capt:'',
            nickname:'',
            d1:'block',
            d2:'none',
            d3:'none',
            e2:'#e33232',
            e3:'#e33232',
            b1:'disabled',
            b2:'disabled',
            b3:'disabled',
        }
    }
    changephone = (e: any) =>{
        let phone = e.target.value;
        this.setState({
            phone:phone
        })
        console.log(this.state.phone)
    }
    changepw = (e: any) =>{
        let pw = e.target.value.replace(/\s+/g,'');
        let flag = 0;
        this.setState({
            pw:pw
        })
        if(pw.length>=8&&pw.length<=20){
            flag = 1;
            this.setState({
                e3:'#666'
            })
        }
        else{
            flag = 0;
            this.setState({
                e3:'#e33232'
            })
        }
        const Rep = '^(((?=.*[0-9])(?=.*[a-zA-Z])|(?=.*[0-9])(?=.*[^\s0-9a-zA-Z])|(?=.*[a-zA-Z])(?=.*[^\s0-9a-zA-Z]))[^\s]+)$'; 
        const patt = new RegExp(Rep,"g"); 
        const result = patt.test(pw);
        if(result === true){
            this.setState({
                e2:'#666'
            })
        }
        else{
            this.setState({
                e2:'#e33232'
            })
        }
        if(flag===1 && result===true){
            this.setState({
                b1:''
            })
        }
        else{
            this.setState({
                b1:'disabled'
            })
        }
        console.log(this.state.pw)
    }
    changecapt = (e: any) =>{
        let capt = e.target.value;
        this.setState({
            capt:capt
        })
        if(capt.length === 4){
            this.setState({
                b2:''
            })
        }
        else{
            this.setState({
                b2:'disabled'
            })
        }
        console.log(this.state.capt)
    }
    changenickname = (e: any) =>{
        let nickname = e.target.value;
        this.setState({
            nickname: nickname
        })
        console.log(this.state.nickname)
    }
    submit1 = (e: any) =>{
        axios.post('http://101.33.207.151:3000/captcha/sent',{
            phone: this.state.phone
        })
        .then(res=>{
            console.log(res);
        });
        this.setState({
            d1:'none',
            d2:'block'
        })
    }
    submit2 = (e: any) =>{
        axios.post('http://101.33.207.151:3000/captcha/verify',{
            phone: this.state.phone,
            captcha: this.state.capt
        })
        .then(res=>{
            console.log(res);
        });
        this.setState({
            d2:'none',
            d3:'block'
        })
    }
    submit3 = (e: any) =>{
        axios.post('http://101.33.207.151:3000/register/cellphone',{
            phone: this.state.phone,
            captcha: this.state.capt,
            password:this.state.pw,
            nickname:this.state.nickname
        })
        .then(res=>{
            console.log(res);
        });
    }
    render(){
        return(
            <div className={'register-wrap'}>
                <div className={'register-top'}>
                    <div>手机号注册</div>
                </div>
                <div className={'register-info-wrap'}>
                    <div className={'register-info'} style={{display:this.state.d1}}>
                        <div>
                            <span>手机号:</span>
                        </div>
                        <div className={'u-phone-wrap'}>
                            <div>
                                <a className={'current'}>
                                    <span>+86</span>
                                </a>
                            </div>
                            <div className='u-phone-text'>
                                <input type="text" className={'u-phone'} placeholder='请输入手机号' value={this.state.phone} onChange={this.changephone}></input>
                            </div>
                        </div>
                        <div>
                            <span>密码:</span>
                        </div>
                        <div className={'u-pw-wrap'}>
                            <input type="password" className={'u-pw'} placeholder='设置登录密码，不少于8位' value={this.state.pw} onChange={this.changepw}></input>
                        </div>
                        <div>
                            <div className={'u-pw-err'} style={{color:'#666'}}>
                                <span>
                                    密码不能包空格
                                </span>
                            </div>
                            <div className={'u-pw-err'} style={{color:this.state.e2}}>
                                <span>
                                    包含字母、数字、符号中至少两种
                                </span>
                            </div>
                            <div className={'u-pw-err'} style={{color:this.state.e3}}>
                                <span>
                                    密码长度为8-20位
                                </span>
                            </div>
                        </div>
                        <div className={'register-next-wrap'}>
                            <button className={'register-next'} onClick={this.submit1} disabled={this.state.b1}>下一步</button>
                        </div>
                    </div>
                    <div className='register2-info' style={{display:this.state.d2}}>
                        <div className='register2-msg-wrap'>
                            <p className={'register2-msg-phone-wrap'}>你的手机号是:
                                <strong>
                                    <span>+86</span>
                                    <span>{this.state.phone}</span>
                                </strong>
                            </p>
                            <p className='register2-msg'>
                                为了安全，我们会给你发送短信验证码
                            </p>
                        </div>
                        <div className='register2-input-wrap'>
                            <div className='register2-input'>
                                <div className='register2-captcha-wrap'>
                                    <input type="text" maxLength={4} className='register2-captcha' value={this.state.capt} onChange={this.changecapt}/>
                                </div>
                            </div>
                        </div>
                        <div>
                            <a className={'captcha-resend'}>重新发送</a>
                        </div>
                        <div className={'register-next-wrap'}>
                            <button className={'register-next'} onClick={this.submit2} disabled={this.state.b2}>下一步</button>
                        </div>
                    </div>
                    <div className={'register3-info'} style={{display:this.state.d3}}>
                    <div className='register2-msg-wrap'>
                            <p className='register3-msg'>
                                请输入您的昵称
                            </p>
                        </div>
                        <div className='register2-input-wrap'>
                            <div className='register2-input'>
                                <div className='register2-captcha-wrap'>
                                    <input type="text" className='register2-captcha' value={this.state.nickname} onChange={this.changenickname}/>
                                </div>
                            </div>
                        </div>
                        <div className={'register-next-wrap'}>
                            <button className={'register-next'} onClick={this.submit3} style={{marginTop:"20px"}} disabled={this.state.b3}>完成注册</button>
                        </div>
                    </div>
                </div>
                <div className={'register-back-wrap'}>
                    <a className={'register-back'}>返回登录</a>
                </div>
            </div>
        )
    }
}

export default Register;