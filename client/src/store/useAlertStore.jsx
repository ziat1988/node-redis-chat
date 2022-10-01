import create from "zustand";

const useAlertStore = create(set=>({
    error: null,
    setError: (error)=>set(state=>({...state,error:error}))
}))

export default useAlertStore;