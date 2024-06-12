import cors from "@elysiajs/cors";
import { Elysia } from "elysia";

type SessionUser = Map<string, { value: number }>;
type Session = Map<string, { users: SessionUser }>;

const clients = new Map();
const sessions: Session = new Map();

const updateSessionData = (sessionId: string) => {
  const users: { id: string; name: string; value: number }[] = [];

  sessions
    .get(sessionId)
    ?.users.forEach(({ value }, userId) =>
      users.push({ id: userId, name: `User ${userId}`, value })
    );

  users.forEach((user) =>
    clients.get(user.id).send({ type: "UPDATE_SESSION", data: { users } })
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
      clients.set(ws.id, ws);
      const session = ws.data.query.session;
      if (!session || !sessions.has(session)) {
        console.log("Session not found", ws.id);
        return;
      }

      sessions.get(session)?.users.set(ws.id, { value: 3 });

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
    message(ws, message) {
      console.log(message);
    },
  })
  .listen(3333);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
