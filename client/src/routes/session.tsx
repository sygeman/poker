import { A, useParams } from "@solidjs/router";
import { Show, createSignal, type Component } from "solid-js";
import { Card } from "../components/card";
import type { Session, SocketAction } from "../types";

export const SessionRoute: Component = () => {
  const params = useParams();
  const [session, setSession] = createSignal<Session | null>(null);

  const socket = new WebSocket(
    `ws://localhost:3333/?session=${params.session}`
  );

  socket.addEventListener("open", () => {
    const savedName = localStorage.getItem("name");
    if (savedName) socketAction({ type: "SET_NAME", data: savedName });
  });

  socket.addEventListener("message", (event) => {
    try {
      const { type, data } = JSON.parse(event.data);
      if (type === "UPDATE_SESSION") setSession(data);
    } catch (error) {
      console.error(error);
    }
  });

  const socketAction = (payload: SocketAction) => {
    try {
      socket.send(JSON.stringify(payload));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div class="bg-black text-white inset-0 size-full absolute">
      <div class="bg-indigo-950/80 inset-0 size-full absolute bg-gradient-to-b from-indigo-900">
        <div class="h-12 flex w-full px-4 items-center justify-between font-semibold">
          <A href="/">Покер</A>
        </div>

        <div class="flex py-10 justify-center">
          <div class="flex gap-6 relative">
            {session()?.valuesSet.map((value) => (
              <Card
                value={value}
                selected={value === session()?.currentUser.value}
                size={2}
                onClick={() => socketAction({ type: "SET_VALUE", data: value })}
              />
            ))}
            <Show when={session()?.avg > 0}>
              <div class="h-px w-full absolute left-0 -bottom-4 flex bg-black/40">
                <div
                  class="h-px w-full absolute left-0 flex bg-indigo-300/40"
                  style={{ width: `${session()?.percent}%` }}
                >
                  <div class="right-0 top-2 absolute text-xs font-semibold">
                    <span>{session()?.avg.toFixed(1)}</span>
                    <span class="text-indigo-300/40">
                      /{session()?.maxValue}
                    </span>
                  </div>
                </div>
              </div>
            </Show>
          </div>
        </div>

        <div class="flex py-4 justify-center space-x-2">
          {session()?.hiddenValues ? (
            <button
              class="bg-indigo-300/20 hover:bg-indigo-300/30 px-2 py-1 rounded"
              onClick={() => socketAction({ type: "SHOW_VALUES" })}
            >
              Показать результаты
            </button>
          ) : (
            <button
              class="bg-indigo-300/20 hover:bg-indigo-300/30 px-2 py-1 rounded"
              onClick={() => socketAction({ type: "RESET_VALUES" })}
            >
              Сбросить
            </button>
          )}
        </div>

        <div class="flex py-4 justify-center">
          <div class="flex gap-4 py-4 justify-center flex-col items-end">
            {session()?.users.map(({ id, name, value }) => (
              <div class="flex items-center gap-2 h-10 w-full bg-black/40 rounded-lg relative">
                <Show when={id === session()?.currentUser.id}>
                  <div class="absolute right-full text-xs text-nowrap text-white/50 text-right px-4">
                    Это вы
                  </div>
                </Show>

                {id === session()?.currentUser.id ? (
                  <input
                    class="flex w-80 px-4 text-sm font-semibold bg-transparent h-full outline-none"
                    value={name}
                    onChange={(e) => {
                      socketAction({ type: "SET_NAME", data: e.target.value });
                      localStorage.setItem("name", e.target.value);
                    }}
                  />
                ) : (
                  <div class="flex w-80 px-4 text-sm font-semibold">{name}</div>
                )}

                <Card value={value} size={1} selected={true} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
