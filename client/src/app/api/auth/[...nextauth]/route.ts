import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import AppleProvider from "next-auth/providers/apple"
import LineProvider from "next-auth/providers/line"
import { AuthOptions } from "next-auth"

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || "",
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
            authorization: {
                params: {
                    scope: 'public_profile',
                },
            },
        }),
        AppleProvider({
            clientId: process.env.APPLE_ID || "",
            clientSecret: process.env.APPLE_SECRET || "",
        }),
        LineProvider({
            clientId: process.env.LINE_CLIENT_ID || "",
            clientSecret: process.env.LINE_CLIENT_SECRET || "",
        }),
    ],
    pages: {
        signIn: '/', // Custom sign-in page (our landing page)
    },
    callbacks: {
        async session({ session, token }) {
            if (session?.user) {
                // @ts-ignore
                session.user.id = token.sub;
                // @ts-ignore
                session.user.provider = token.provider;
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.sub = user.id;
            }
            if (account) {
                token.provider = account.provider;
            }
            return token;
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
