import { A } from "@solidjs/router";
import type { Component } from "solid-js";

export const Home: Component = () => {
  return (
    <div class="bg-black text-white inset-0 size-full absolute">
      <div class="bg-indigo-950/80 inset-0 size-full absolute bg-gradient-to-b from-indigo-900 items-center justify-center flex">
        <A href="/762201">Создать комнату</A>
      </div>
    </div>
  );
};
