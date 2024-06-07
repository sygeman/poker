import { A } from "@solidjs/router";
import type { Component } from "solid-js";

export const Home: Component = () => {
  return (
    <div class="bg-black text-white inset-0 size-full absolute justify-center items-center flex">
      <A href="/sessionid">Create room</A>
    </div>
  );
};
