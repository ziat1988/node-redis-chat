import React, {useRef} from 'react';
import styled from "styled-components";
import {login} from "../../api.js";
import useUserStore from "../../store/useUserStore.jsx";
import useAlertStore from "../../store/useAlertStore.jsx";
import ToastAlert from "../Toast/InfoMessage";
import {useNavigate} from "react-router-dom";


const FormWrapper = styled.div`
    width: 300px;
    margin: 30px auto;
`

function Index(props) {

    const refUsername = useRef(null);
    const refPassword = useRef(null);
    const setUser= useUserStore(state=>state.setUser);
    const setError = useAlertStore(state=>state.setError);
    const error = useAlertStore(state=>state.error);
    const navigate = useNavigate();

    const handleSubmit = (e)=>{
        e.preventDefault();

        login(refUsername.current.value,refPassword.current.value)
            .then(res=>{
                setUser(res.data)
                navigate("/chat")
            })
            .catch(err=>{
                console.log('error here', err)
                setError(err);
            })
        ;
    }
    return (
        <FormWrapper>
            <form onSubmit={handleSubmit}>
                <div className={'mb-3'}>
                    <input ref={refUsername} type={'text'} className={'form-control'} placeholder={'username'}/>
                </div>
                <div className={'mb-3'}>
                    <input ref={refPassword} type={'password'} className={'form-control'} placeholder={'password'} />
                </div>
                <button className={"btn btn-primary"} type={'submit'}>Login</button>
            </form>

            {error && <ToastAlert error={error}/>}
        </FormWrapper>
    );
}

export default Index;
