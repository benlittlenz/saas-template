import { ResetPasswordRequest } from "@prisma/client";
import dayjs from "dayjs";
import { GetServerSidePropsContext } from "next";
import { getCsrfToken } from "next-auth/react";
import Link from "next/link";
import React, { useMemo } from "react";
import { prisma } from "../../server/db/client";
import { Button } from "../../ui/Button";
import { Form } from "../../ui/form/Form";
import { Input } from "../../ui/form/Input";
import { trpc } from "../../utils/trpc";
import {
  IResetPassword,
  resetPasswordSchema,
} from "../../utils/validation/auth";

interface ResetPasswordProps {
  resetToken: string;
  resetPasswordRequest: ResetPasswordRequest;
  csrfToken: string;
}

const ResetPasswordPage = ({
  resetToken,
  resetPasswordRequest,
  csrfToken,
}: ResetPasswordProps) => {
  const [error, setError] = React.useState<{ message: string } | null>(null);
  const [success, setSuccess] = React.useState(false);

  const { mutateAsync } = trpc.useMutation(["user.reset-password"], {
    onSuccess: () => setSuccess(true),
    onError: (error) => console.log("ERROR", error),
  });

  const Success = () => {
    return (
      <>
        <div className="space-y-6">
          <div>
            <h2 className="font-cal mt-6 text-center text-3xl font-extrabold text-gray-900">
              Success!
            </h2>
          </div>
          <p>Password has been reset. Please login.</p>
          <Link href="/login">
            <button
              type="button"
              className="flex w-full justify-center px-4 py-2 text-sm font-medium text-blue-600 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              Login
            </button>
          </Link>
        </div>
      </>
    );
  };

  const Expired = () => {
    return (
      <>
        <div className="space-y-6">
          <div>
            <h2 className="font-cal mt-6 text-center text-3xl font-extrabold text-gray-900">
              Something went wrong.
            </h2>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Request has expired.
            </h2>
          </div>
          <p>Please submit a new request to reset your password</p>
          <Link href="/auth/forgot-password" passHref>
            <button
              type="button"
              className="flex w-full justify-center px-4 py-2 text-sm font-medium text-blue-600 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              Try again
            </button>
          </Link>
        </div>
      </>
    );
  };

  const isRequestExpired = useMemo(() => {
    const now = dayjs();
    return dayjs(resetPasswordRequest.expires).isBefore(now);
  }, [resetPasswordRequest]);

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-2 space-y-6 rounded-lg bg-white px-4 py-8 shadow sm:px-10">
          {isRequestExpired && <Expired />}
          {!isRequestExpired && !success && (
            <>
              <div className="space-y-6">
                <h2 className="font-cal mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Reset Password
                </h2>
                <p>Enter a new password</p>
                {error && <p className="text-red-600">{error.message}</p>}
              </div>
              <Form<IResetPassword, typeof resetPasswordSchema>
                onSubmit={async (values) => {
                  console.log("VALUES HERE", values);
                  await mutateAsync({ ...values, resetToken });
                }}
                schema={resetPasswordSchema}
                options={{
                  shouldUnregister: true,
                }}
              >
                {({ register }) => (
                  <>
                    <Input
                      name="resetToken"
                      defaultValue={csrfToken}
                      hidden
                      registration={register("resetToken")}
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
                    <Button type="submit">Register</Button>
                  </>
                )}
              </Form>
            </>
          )}
          {!isRequestExpired && success && (
            <>
              <Success />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id as string;
  try {
    const resetPasswordRequest = await prisma.resetPasswordRequest.findUnique({
      rejectOnNotFound: true,
      where: {
        id,
      },
      select: {
        id: true,
        expires: true,
      },
    });

    return {
      props: {
        resetPasswordRequest: {
          ...resetPasswordRequest,
          expires: resetPasswordRequest.expires.toString(),
        },
        resetToken: id,
        csrfToken: await getCsrfToken({ req: context.req }),
      },
    };
  } catch (reason) {
    return {
      notFound: true,
    };
  }
}

export default ResetPasswordPage;
