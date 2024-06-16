import { useNavigate } from "@solidjs/router";
import type { Component } from "solid-js";
import { createRoom } from "../api/poker";

export const HomeRoute: Component = () => {
  const navigate = useNavigate();

  return (
    <div class="bg-black text-white inset-0 size-full absolute">
      <div class="bg-indigo-950/80 inset-0 size-full absolute bg-gradient-to-b from-indigo-900 items-center justify-center flex">
        <button
          onClick={async () => {
            const roomId = await createRoom();
            navigate(`/${roomId}`);
          }}
        >
          Создать комнату
        </button>
      </div>
    </div>
  );
};
