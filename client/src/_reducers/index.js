import { combineReducers } from 'redux';
import user from './user_reducer';
// 더 많은 리듀서를 나중에 추가할 수 있음
const rootReducer = combineReducers({
  // 예시: user: userReducer,
  user
});

export default rootReducer;