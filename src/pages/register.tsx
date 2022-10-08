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

const RegisterPage = () => {
  const router = useRouter();

  const [error, setError] = React.useState<null | string>(null);
  const { isLoading, mutateAsync } = trpc.useMutation(["user.register"], {
    onSuccess: () => {
      router.push("/");
      showToast("Successfully registered!", "success");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  return (
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
