import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";

//createStore(reducer, [preloadedState], [enhancer])
export const store = createStore(reducers, {}, applyMiddleware(thunk));
