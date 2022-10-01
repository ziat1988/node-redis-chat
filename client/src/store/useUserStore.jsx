import create from 'zustand';

const demoUser = {
    id:1,
    username:"tom"
}
const useUserStore = create((set)=>({
    userLogged: demoUser,
    setUser:(user)=>set(state=>({...state,userLogged:user})),

}))

export default useUserStore;