import { A, useParams } from "@solidjs/router";
import { Show, createMemo, createSignal, type Component } from "solid-js";
import { Card } from "../components/card";

type User = {
  id: string;
  name: string;
  value: number;
};

export const Session: Component = () => {
  const params = useParams();
  const valuesSet = [1, 2, 3, 5, 8, 13, 21];
  const [currentUser, setCurrentUser] = createSignal<User | null>(null);
  const [users, setUsers] = createSignal<User[]>([]);

  if (!localStorage.getItem("token")) {
    localStorage.setItem("token", "asdff233f23");
  }

  const token = localStorage.getItem("token");

  const socket = new WebSocket(
    `ws://localhost:3333/?session=${params.session}&token=${token}`
  );

  socket.addEventListener("message", (event) => {
    try {
      const { type, data } = JSON.parse(event.data);

      if (type === "UPDATE_SESSION") {
        setUsers(data.users);
        setCurrentUser(data.users.find((user) => user.id === data.currentUser));
      }
    } catch (error) {
      console.error(error);
    }
  });

  const avg = createMemo(
    () =>
      users().reduce((a, b) => a + b.value, 0) /
      users().filter((user) => user.value > 0).length
  );
  const percent = createMemo(() => (avg() / 21) * 100);

  const setValue = (value: number) => {
    socket.send(JSON.stringify({ type: "SET_VALUE", data: value }));
  };

  const setName = (name: string) => {
    socket.send(JSON.stringify({ type: "SET_NAME", data: name }));
  };

  return (
    <div class="bg-black text-white inset-0 size-full absolute">
      <div class="bg-indigo-950/80 inset-0 size-full absolute bg-gradient-to-b from-indigo-900">
        <div class="h-12 flex w-full px-4 items-center justify-between font-semibold">
          <A href="/">Покер</A>
          <div class="text-xs">
            Сессия <span class="text-indigo-300/40">{params.session}</span>
          </div>
        </div>

        <div class="flex py-10 justify-center">
          <div class="flex gap-6 relative">
            {valuesSet.map((value) => (
              <Card
                value={value}
                selected={value === currentUser()?.value}
                size={2}
                onClick={() => setValue(value)}
              />
            ))}
            <Show when={avg() > 0}>
              <div class="h-px w-full absolute left-0 -bottom-4 flex bg-black/40">
                <div
                  class="h-px w-full absolute left-0 flex bg-indigo-300/40"
                  style={{ width: `${percent()}%` }}
                >
                  <div class="right-0 top-2 absolute text-xs font-semibold">
                    <span>{avg().toFixed(1)}</span>
                    <span class="text-indigo-300/40">/21</span>
                  </div>
                </div>
              </div>
            </Show>
          </div>
        </div>

        <div class="flex py-4 justify-center">
          <div class="flex gap-4 py-4 justify-center flex-col items-end">
            {users().map(({ id, name, value }) => (
              <div class="flex items-center gap-2 h-10 w-full bg-black/40 rounded-lg relative">
                <Show when={id === currentUser()?.id}>
                  <div class="absolute right-full text-xs text-nowrap text-white/50 text-right px-4">
                    Это вы
                  </div>
                </Show>

                {id === currentUser()?.id ? (
                  <input
                    class="flex w-80 px-4 text-sm font-semibold bg-transparent"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
