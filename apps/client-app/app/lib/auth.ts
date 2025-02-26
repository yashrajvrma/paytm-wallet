import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaClient } from "@repo/db/client";

const prisma = new PrismaClient();
const saltRounds = 10;

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phoneNumber: {
          label: "Phone Number",
          type: "text",
          placeholder: "91323282818",
          required: true,
        },
        password: {
          label: "Password",
          type: "password",
          required: true,
        },
      },
      async authorize(credentials: any) {
        // check if user exist
        const existingUser = await prisma.user.findUnique({
          where: {
            phone_number: credentials.phoneNumber,
          },
        });

        if (existingUser) {
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );
          if (isPasswordValid) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              email: existingUser.email,
            };
          }
          return null;
        }

        // hash password
        const hashedPassword = await bcrypt.hash(
          credentials.password,
          saltRounds
        );

        // create new user
        try {
          const user = await prisma.user.create({
            data: {
              phone_number: credentials.phoneNumber,
              password: hashedPassword,
            },
          });
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async session({ token, session }: any) {
      session.user.id = token.sub;
      return session;
    },
  },
};
