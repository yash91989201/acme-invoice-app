// UTILS
import { getServerAuthSession } from "@/server/auth";
// CUSTOM COMPONENTS
import NotSignedInModal from "./not-signed-in-modal";

export default async function NotSignedIn() {
  const session = await getServerAuthSession();

  return session == null ? <NotSignedInModal /> : <></>;
}
