import NextAuth, {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/params";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }