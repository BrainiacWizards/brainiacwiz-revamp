// example API route
export async function GET(request: Request) {
  console.log("GET request received", request);

  return new Response("Hello, this is an example API route!");
}

export async function POST(request: Request) {
  const data = await request.json();

  return new Response(`You sent: ${JSON.stringify(data)}`);
}

export async function PUT(request: Request) {
  const data = await request.json();

  return new Response(`You updated: ${JSON.stringify(data)}`);
}

export async function DELETE(request: Request) {
  console.log("DELETE request received", request);

  return new Response("Resource deleted successfully!");
}
