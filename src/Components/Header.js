import React from 'react';
import '../Styles/header.css';
import Modal from 'react-modal';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { withRouter } from 'react-router-dom';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'brown'
    }
};

class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            loginModalIsOpen: false,
            userName: undefined,
            isLoggedIn: false
        }
    }

    handleLogin = () => {
        this.setState({ loginModalIsOpen: true })
    }

    handleClose = () => {
        this.setState({ loginModalIsOpen: false })
    }

    responseGoogle = (response) => {
        this.setState({ userName: response.profileObj.name, isLoggedIn: true, loginModalIsOpen: false })
    }

    responseFacebook = (response) => {
        this.setState({ userName: response.name, isLoggedIn: true, loginModalIsOpen: false })
    }

    handleLogout = () => {
        this.setState({ isLoggedIn: false, userName: undefined });
    }

    handleNavigate = () => {
        this.props.history.push('/');
    }

    render() {
        const { loginModalIsOpen, isLoggedIn, userName } = this.state;
        return (
            <div className="app-header">
                <div style={{ display: 'inline-block' }} className="small-logo" onClick={this.handleNavigate}>
                    <b>e!</b>
                </div>
                { isLoggedIn ? <div style={{ float: 'right', display: 'inline-block' }}>
                    <div style={{ display: 'inline-block' }} className="login">{userName}</div>
                    <div style={{ display: 'inline-block', width: '80px' }} className="signUp login" onClick={this.handleLogout}>Logout</div>
                </div> :
                    <div style={{ float: 'right', display: 'inline-block' }}>
                        <div style={{ display: 'inline-block' }} className="login" onClick={this.handleLogin}>Login</div>
                        <div style={{ display: 'inline-block' }} className="signUp login">Create an account</div>
                    </div>}
                <Modal
                    isOpen={loginModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div className="glyphicon glyphicon-remove" style={{ float: 'right', margin: '5px' }} onClick={this.handleClose}></div>
                        <div>
                            <GoogleLogin
                                clientId="673822415344-auqk30qor9hj4vh11eqtf8ncj1dp3nie.apps.googleusercontent.com"
                                buttonText="Continue with Google"
                                onSuccess={this.responseGoogle}
                                onFailure={this.responseGoogle}
                                cookiePolicy={'single_host_origin'}
                            />
                            <FacebookLogin
                                appId="147211824006116"
                                fields="name,email,picture"
                                textButton="Continue with Fb"
                                callback={this.responseFacebook} />
                            <div className="signUp login">Continue with Credentials</div>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withRouter(Header);