const API_GATEWAY = "http://localhost:3333/";

export const createRoom = async () => {
  const createRoomMutation = await fetch(`${API_GATEWAY}rooms/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await createRoomMutation.json();

  return data?.roomId;
};

export const renameUser = (name: string) => {
  console.log("renameUser");
};

export const setValue = () => {
  console.log("setValue");
};

export const resetValues = () => {
  console.log("resetValues");
};
