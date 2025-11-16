// store.js
import { createStore } from "redux";

const initialData = {
  currentUserData: null,
  doctorData:null,
  myCartItems: 0,
  checkoutTotalBalance: 0,
};
interface Action {
  type: string;
  payload?: any;
}
function Reducer(state = initialData, action: Action) {
  switch (action.type) {
    case "currentUserData":
      return { ...state, currentUserData: action.payload };
      case "doctorData":
      return { ...state, doctorData: action.payload };
    default:
      return state;
  }
}

const store = createStore(Reducer);
export default store;
export const dispatch = store.dispatch;



