import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Toaster } from "react-hot-toast";
import { Button } from "../ui/Button";
import { Form } from "../ui/form/Form";
import { Input } from "../ui/form/Input";
import AuthContainer from "../ui/layout/AuthContainer";
import showToast from "../ui/Toast";
import { trpc } from "../utils/trpc";
import { IRegister, registerSchema } from "../utils/validation/auth";

const Success = () => {
  return (
    <div className="space-y-6">
      <div className="pb-6">
        <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
          Account successfully created
        </h2>
        <p className="mt-2 text-center text-md font-normal text-gray-400">
          Click the link below to login
        </p>
      </div>
      <Button className="mx-auto">
        <Link href="/login">Login</Link>
      </Button>
    </div>
  );
};

const RegisterPage = () => {
  const router = useRouter();

  const [error, setError] = React.useState<null | string>(null);
  const { isLoading, status, mutateAsync } = trpc.useMutation(
    ["user.register"],
    {
      onSuccess: () => {
        console.log("success");
        // router.push("/");
        // showToast("Successfully registered!", "success");
      },
      onError: (error) => {
        setError(error.message);
      },
    },
  );

  return (
    <div>
      {status !== "success" && (
        <AuthContainer title="Register an account">
          {error && (
            <p className="mb-2 text-sm font-semibold text-red-500">{error}</p>
          )}
          <Form<IRegister, typeof registerSchema>
            onSubmit={async (values) => {
              const result = await mutateAsync(values);
            }}
            schema={registerSchema}
            options={{
              shouldUnregister: true,
            }}
          >
            {({ register }) => (
              <>
                <Input
                  label="Name"
                  type="text"
                  name="name"
                  registration={register("name")}
                />
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
                <Input
                  label="Confirm password"
                  type="password"
                  name="passwordConfirm"
                  registration={register("passwordConfirm")}
                />
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Register
                </Button>
              </>
            )}
          </Form>
          <div className="pt-2">
            <span className="font-medium text-sm text-gray-900">
              Already have an account?{" "}
            </span>
            <Link href="/login">
              <a className="text-sm font-semibold text-gray-900 hover:underline">
                Login here
              </a>
            </Link>
          </div>
        </AuthContainer>
      )}
      {status === "success" && (
        <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="mx-2 space-y-6 rounded-lg bg-white px-4 py-8 shadow sm:px-10">
              <Success />
            </div>
          </div>
        </div>
      )}
    </div>
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

export default RegisterPage;
