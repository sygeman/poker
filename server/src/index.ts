import cors from "@elysiajs/cors";
import { Elysia, t } from "elysia";

type SessionUser = Map<string, { value: number; name: string }>;
type Session = Map<string, { users: SessionUser }>;

const clients = new Map();
const sessions: Session = new Map();

const updateSessionData = (sessionId: string) => {
  const users: { id: string; name: string; value: number }[] = [];

  sessions
    .get(sessionId)
    ?.users.forEach(({ value, name }, userId) =>
      users.push({ id: userId, name, value })
    );

  users.forEach((user) =>
    clients
      .get(user.id)
      .send({ type: "UPDATE_SESSION", data: { users, currentUser: user.id } })
  );
};

const app = new Elysia()
  .use(cors())
  .post("/rooms/create", () => {
    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, { users: new Map() });

    return { roomId: sessionId };
  })
  .ws("/", {
    open(ws) {
      const token = ws.data.query.token;

      clients.set(ws.id, ws);
      const session = ws.data.query.session;
      if (!session || !sessions.has(session)) {
        console.log("Session not found", ws.id);
        return;
      }

      sessions
        .get(session)
        ?.users.set(ws.id, { value: 0, name: `User ${ws.id}` });

      updateSessionData(session);
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
    message(ws, message: any) {
      const session = ws.data.query.session;
      if (!session) return;
      const user = sessions.get(session)?.users.get(ws.id);
      if (!user) return;

      if (message.type === "SET_VALUE") {
        sessions
          .get(session)
          ?.users.set(ws.id, { ...user, value: message.data });
      } else if (message.type === "SET_NAME") {
        sessions
          .get(session)
          ?.users.set(ws.id, { ...user, name: message.data });
      }

      updateSessionData(session);
    },
  })
  .listen(3333);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
