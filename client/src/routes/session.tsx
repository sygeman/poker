import { A, useParams } from "@solidjs/router";
import { createSignal, type Component } from "solid-js";
import { Card } from "../components/card";

export const Session: Component = () => {
  const params = useParams();
  const valuesSet = [1, 2, 3, 5, 8, 13, 21];
  const [selected, setSelected] = createSignal(0);
  const users = [
    { name: "User 1", value: 3 },
    { name: "User 2", value: 21 },
    { name: "Username looong 2", value: 5 },
  ];
  const avg = users.reduce((a, b) => a + b.value, 0) / users.length;
  const percent = (avg / 21) * 100;

  return (
    <div class="bg-black text-white inset-0 size-full absolute">
      <div class="bg-indigo-950/80 inset-0 size-full absolute bg-gradient-to-b from-indigo-900">
        <div class="h-12 flex w-full px-4 items-center justify-between font-semibold">
          <A href="/">Home</A>
          <div>Session {params.session}</div>
          <div>Username</div>
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
            <div class="h-px w-full absolute left-0 -bottom-4 flex ">
              <div
                class="h-px w-full absolute left-0 flex bg-black"
                style={{ width: `${percent}%` }}
              >
                <div class="right-0 top-2 absolute text-xs">
                  avg - {avg.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex py-4 justify-center">
          <div class="flex gap-4 py-4 justify-center flex-col items-end">
            {users.map(({ name, value }) => (
              <div class="flex items-center gap-2 w-full bg-black/20 rounded-lg">
                <div class="flex w-80 px-4 text-sm">{name}</div>
                <Card value={value} size={1} selected={true} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
