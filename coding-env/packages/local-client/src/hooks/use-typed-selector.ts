import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "../state";

//implement our own hook to get the type of state from useSelector
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
