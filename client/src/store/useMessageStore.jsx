import create from 'zustand';

const useMessageStore = create((set)=>({
    newMsg: null,
    setNewMsg:(msg)=>set(state=>({...state,newMsg:msg})),
}))

export default useMessageStore;