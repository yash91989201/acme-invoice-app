import { getServerAuthSession } from "@/server/auth";

export default async function Dashboard() {
  const session = await getServerAuthSession();
  console.log(session);

  return (
    <>
      <p>Dashboard page</p>
    </>
  );
}
