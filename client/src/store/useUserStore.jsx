import create from 'zustand';

const useUserStore = create((set)=>({
    userLogged: null,
    setUser:(user)=>set(state=>({...state,userLogged:user})),
}))

export default useUserStore;