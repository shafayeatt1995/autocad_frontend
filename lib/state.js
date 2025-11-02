"use client";

import { useSyncExternalStore } from "react";

let state = {
  user: null,
  drawer: false,
};

let listeners = new Set();

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const setState = (partial) => {
  state = { ...state, ...partial };
  listeners.forEach((l) => l());
};

export const getState = () => state;

export const useStore = (selector = (s) => s) => {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state)
  );
};

// import { useStore, setState } from "@/lib/store";
// const user = useStore((s) => s.user);
// <button onClick={() => setState({ user: "Shafayet" })}>
