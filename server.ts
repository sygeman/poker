import cors from "@elysiajs/cors";
import { Elysia, t } from "elysia";
import { staticPlugin } from "@elysiajs/static";

type SessionUser = Map<string, { value: number; name: string }>;
type Session = Map<string, { users: SessionUser; hiddenValues: Boolean }>;

const valuesSet = [1, 2, 3, 5, 8, 13, 21];
const clients = new Map();
const sessions: Session = new Map();

const updateSessionData = (sessionId: string) => {
  const users: { id: string; name: string; value: number }[] = [];
  const session = sessions.get(sessionId);
  if (!session) return;

  session.users.forEach(({ value, name }, userId) =>
    users.push({ id: userId, name, value })
  );

  const hiddenValues = session.hiddenValues;
  const maxValue = valuesSet[valuesSet.length - 1];
  const usersForStats = users.filter((user) => user.value > 0);
  let avg = 0;
  let percent = 0;

  if (!hiddenValues) {
    avg = usersForStats.reduce((a, b) => a + b.value, 0) / usersForStats.length;
    percent = (avg / maxValue) * 100;
  }

  users.forEach((user) =>
    clients.get(user.id).send({
      type: "UPDATE_SESSION",
      data: {
        users: users.map((userData) => ({
          ...userData,
          value:
            hiddenValues && userData.id !== user.id
              ? userData.value > 0
                ? 0
                : -1
              : userData.value,
        })),
        currentUser: user,
        hiddenValues,
        valuesSet,
        maxValue,
        avg,
        percent,
      },
    })
  );
};

const app = new Elysia()
  .use(cors())
  .get("/", () => Bun.file("dist/index.html"))
  .use(staticPlugin({ assets: "dist/assets", prefix: "/assets" }))
  .post("/api/new", () => {
    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, { users: new Map(), hiddenValues: true });
    return { roomId: sessionId };
  })
  .ws("/", {
    body: t.Union([
      t.Object({
        type: t.Literal("SET_VALUE"),
        data: t.Union(valuesSet.map((value) => t.Literal(value))),
      }),
      t.Object({
        type: t.Literal("SET_NAME"),
        data: t.RegExp(/^[а-яa-z ,.'-]+$/i),
      }),
      t.Object({
        type: t.Literal("SHOW_VALUES"),
      }),
      t.Object({
        type: t.Literal("RESET_VALUES"),
      }),
    ]),
    message(ws, message) {
      const userId = ws.id;
      const sessionId = ws.data.query.session;
      if (!sessionId) return;
      const session = sessions.get(sessionId);
      if (!session) return;
      const user = session.users.get(userId);
      if (!user) return;

      if (message.type === "SET_VALUE") {
        session.users.set(userId, { ...user, value: message.data });
      } else if (message.type === "SET_NAME") {
        session.users.set(userId, { ...user, name: message.data });
      } else if (message.type === "SHOW_VALUES") {
        sessions.set(sessionId, { ...session, hiddenValues: false });
      } else if (message.type === "RESET_VALUES") {
        const users = new Map();
        session.users.forEach(({ name }, id) =>
          users.set(id, { name, value: -1 })
        );
        sessions.set(sessionId, { users, hiddenValues: true });
      }

      updateSessionData(sessionId);
    },
    open(ws) {
      clients.set(ws.id, ws);
      const sessionId = ws.data.query.session;
      if (!sessionId) return;
      const session = sessions.get(sessionId);
      if (!session) {
        console.log("Session not found", ws.id);
        return;
      }

      session.users.set(ws.id, { value: -1, name: `User ${ws.id}` });
      updateSessionData(sessionId);
    },
    close(ws) {
      clients.delete(ws.id);

      const session = ws.data.query.session;
      if (!session || !sessions.has(session)) {
        console.log("Session not found", ws.id);
        return;
      }

      sessions.get(session)?.users.delete(ws.id);
      updateSessionData(session);
    },
  })
  .listen(3333);

console.log(`Running at http://${app.server?.hostname}:${app.server?.port}`);
