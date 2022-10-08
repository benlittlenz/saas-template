import { useRouter } from "next/router";
import { Button } from "../../ui/Button";
import { Form } from "../../ui/form/Form";
import { Input } from "../../ui/form/Input";
import AuthContainer from "../../ui/layout/AuthContainer";
import { trpc } from "../../utils/trpc";
import { forgotPasswordSchema, loginSchema } from "../../utils/validation/auth";

type ForgotPasswordValues = {
  email: string;
};

const ForgotPasswordPage = () => {
  const router = useRouter();

  const { isLoading, mutateAsync } = trpc.useMutation(
    ["user.forgot-password"],
    {
      onSuccess: () => console.log("SUCCESS"),
    },
  );
  console.log("isLoading", isLoading);
  return (
    <AuthContainer title="Forgot password">
      <Form<ForgotPasswordValues, typeof forgotPasswordSchema>
        onSubmit={async (values) => {
          console.log("VALUES HERE", values);
          const res = await mutateAsync(values);
          console.log("RESULT >>> ", res);
        }}
        schema={forgotPasswordSchema}
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
            <Button
              type="submit"
              isLoading={isLoading}
              onClick={() => console.log("CLICKED")}
            >
              Reset Password
            </Button>
          </>
        )}
      </Form>
    </AuthContainer>
  );
};

export default ForgotPasswordPage;
