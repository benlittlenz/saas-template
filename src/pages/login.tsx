import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "../ui/Button";
import { Form } from "../ui/form/Form";
import { Input } from "../ui/form/Input";
import AuthContainer from "../ui/layout/AuthContainer";
import { trpc } from "../utils/trpc";
import { loginSchema } from "../utils/validation/auth";

type LoginValues = {
  email: string;
  password: string;
};

const LoginPage = ({ session }: any) => {
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  return (
    <AuthContainer title="Sign in to your account">
      {error && (
        <p className="mb-2 text-sm font-semibold text-red-500">{error}</p>
      )}
      <Form<LoginValues, typeof loginSchema>
        onSubmit={async (values) => {
          const res = await signIn("credentials", {
            ...values,
            redirect: false,
          });

          if (res?.ok) {
            router.push("/dashboard");
          } else {
            setError("Credentials do not match our records");
          }
        }}
        schema={loginSchema}
        options={{
          shouldUnregister: true,
        }}
      >
        {({ register }) => (
          <>
            <Input
              label="Email"
              type="email"
              name="email"
              registration={register("email")}
            />
            <Input
              label="Password"
              type="password"
              name="password"
              registration={register("password")}
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </>
        )}
      </Form>
      <div className="pt-2">
        <span className="font-medium text-sm text-gray-900">
          Don't have an account?{" "}
        </span>
        <Link href="/register">
          <a className="text-sm font-semibold text-gray-900 hover:underline">
            Create an account
          </a>
        </Link>
      </div>
    </AuthContainer>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { req } = ctx;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

export default LoginPage;
