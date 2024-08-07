import { Context } from "../../index";

import validator from "validator";
import bcrypt from "bcryptjs";

import JWT from "jsonwebtoken";

interface SignupType {
  credentials: {
    email: string;
    password: string;
  };
  name: string;
  bio: string;
}

interface SignInType {
  credentials: {
    email: string;
    password: string;
  };
}

interface AuthPayloadType {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

export const authResolvers = {
  signup: async (
    _: any,
    { credentials, name, bio }: SignupType,
    { prisma }: Context
  ): Promise<AuthPayloadType> => {
    const { email, password } = credentials;

    const isEmail = validator.isEmail(email);

    if (!isEmail) {
      return {
        userErrors: [
          {
            message: "Invalid email",
          },
        ],
        token: null,
      };
    }

    const isValidPassword = validator.isLength(password, {
      min: 8,
    });

    if (!isValidPassword) {
      return {
        userErrors: [
          {
            message: "Invalid password",
          },
        ],
        token: null,
      };
    }

    if (!name || !bio) {
      return {
        userErrors: [
          {
            message: "Invalid name or bio",
          },
        ],
        token: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    await prisma.profile.create({
      data: {
        bio,
        userId: user.id,
      },
    });

    const token = JWT.sign(
      {
        userId: user.id,
        userEmail: user.email,
      },
      "akdjfkhsdjfk",
      { expiresIn: 3600000 }
    );

    console.log(user);

    return {
      userErrors: [],
      token,
    };
  },
  signin: async (
    _: any,
    { credentials }: SignInType,
    { prisma }: Context
  ): Promise<AuthPayloadType> => {
    const { email, password } = credentials;

    const isEmail = validator.isEmail(email);

    if (!isEmail) {
      return {
        userErrors: [
          {
            message: "Invalid email",
          },
        ],
        token: null,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        userErrors: [{ message: "Invalid credentials" }],
        token: null,
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return {
        userErrors: [{ message: "Invalid password!" }],
        token: null,
      };
    }

    return {
      userErrors: [],
      token: JWT.sign({ userId: user.id }, "akdjfkhsdjfk", {
        expiresIn: 3600000,
      }),
    };
  },
};
