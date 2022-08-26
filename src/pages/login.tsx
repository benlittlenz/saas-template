import { GetServerSideProps } from "next";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "../ui/Button";
import { Form } from "../ui/form/Form";
import { Input } from "../ui/form/Input";
import { trpc } from "../utils/trpc";
import { loginSchema } from "../utils/validation/auth";

type LoginValues = {
  email: string;
  password: string;
};

const LoginPage = ({ session }: any) => {
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  console.log("SESSION >>> ", session);
  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      <Form<LoginValues, typeof loginSchema>
        onSubmit={async (values) => {
          const res = await signIn("credentials", {
            ...values,
            redirect: false,
          });

          if (res?.ok) {
            router.push("/dashboard");
          } else {
            console.log("Password does not match", res);
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
              type="text"
              name="email"
              registration={register("email")}
            />
            <Input
              label="Password"
              type="password"
              name="password"
              registration={register("password")}
            />
            <Button type="submit">Register</Button>
          </>
        )}
      </Form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  //   if (!session) {
  //     return {
  //       redirect: {
  //         destination: "/",
  //         permanent: false,
  //       },
  //     };
  //   }

  return {
    props: { session },
  };
};

export default LoginPage;
