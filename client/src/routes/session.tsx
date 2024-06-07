import { A, useParams } from "@solidjs/router";
import { Show, createSignal, type Component } from "solid-js";
import { Card } from "../components/card";

export const Session: Component = () => {
  const params = useParams();
  const valuesSet = [1, 2, 3, 5, 8, 13, 21];
  const [selected, setSelected] = createSignal(0);
  const users = [
    { name: "Антон", value: 3 },
    { name: "Саша", value: 21 },
    { name: "Андрей", value: 0 },
  ];
  const avg = users.reduce((a, b) => a + b.value, 0) / users.length;
  const percent = (avg / 21) * 100;

  return (
    <div class="bg-black text-white inset-0 size-full absolute">
      <div class="bg-indigo-950/80 inset-0 size-full absolute bg-gradient-to-b from-indigo-900">
        <div class="h-12 flex w-full px-4 items-center justify-between font-semibold">
          <A href="/">Покер</A>
          <div>
            Сессия <span class="text-indigo-300/40">{params.session}</span>
          </div>
          <div>Антон</div>
        </div>

        <div class="flex py-10 justify-center">
          <div class="flex gap-6 relative">
            {valuesSet.map((value) => (
              <Card
                value={value}
                selected={value === selected()}
                size={2}
                onClick={() => setSelected(value)}
              />
            ))}
            <div class="h-px w-full absolute left-0 -bottom-4 flex bg-black/40">
              <div
                class="h-px w-full absolute left-0 flex bg-indigo-300/40"
                style={{ width: `${percent}%` }}
              >
                <div class="right-0 top-2 absolute text-xs font-semibold">
                  <span>{avg.toFixed(1)}</span>
                  <span class="text-indigo-300/40">/21</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex py-4 justify-center">
          <div class="flex gap-4 py-4 justify-center flex-col items-end">
            {users.map(({ name, value }) => (
              <div class="flex items-center gap-2 h-10 w-full bg-black/40 rounded-lg">
                <div class="flex w-80 px-4 text-sm font-semibold">{name}</div>
                <Show when={value > 0}>
                  <Card value={value} size={1} selected={true} />
                </Show>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
