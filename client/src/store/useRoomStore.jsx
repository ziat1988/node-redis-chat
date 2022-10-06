import create from 'zustand';

const useRoomStore = create((set)=>({
    roomCurrent: null,
    setRoomCurrent:(idRoom)=>set(state=>({...state,roomCurrent:idRoom})),
}))

export default useRoomStore;