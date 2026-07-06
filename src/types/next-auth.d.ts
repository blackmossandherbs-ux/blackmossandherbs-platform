
/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Auth Type Extensions
 */
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
        } & DefaultSession["user"];
    }

    interface User {
        role: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
    }
}
