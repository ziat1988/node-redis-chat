import React, {useEffect, useState} from 'react';
import Toast from 'react-bootstrap/Toast';

function ToastAlert({error}) {
    const [showToast,setShowToast] = useState(false);
    const toogleShowToast = ()=>setShowToast(!showToast);

    useEffect(()=>{
        if(error){
            setShowToast(true);
        }
    },[error])

    return (
        <Toast
            style={{position:'absolute', bottom: '10px', right:'0px'}}
            className={'custom-toast'}
            show={showToast}
            onClose={toogleShowToast}
            // positon={'top-start'}
            // delay={2000} autohide
            >
            <Toast.Header>
                <strong className="me-auto">Error</strong>
                <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>{error.message}</Toast.Body>
        </Toast>
    );
}

export default ToastAlert;