import Cookies from "js-cookie";

export function userReducer(state = Cookies.get('user') ? JSON.parse(Cookies.get('user')): null, action) {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "LOGOUT":
      return null
    case "VERIFY":  
      return {...state, ...action.payload}
    case "UPDATE_PROFILE_PICTURE":  
      return {...state, ...action.payload}      
    default:
      return state;
  }
}
