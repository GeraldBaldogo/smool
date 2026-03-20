export async function getRequests() {
  const res = await fetch("http://localhost:3000/requests");
  return res.json();
}

export async function createRequest(data: any) {
  const res = await fetch("http://localhost:3000/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
