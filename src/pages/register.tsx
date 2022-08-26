import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { z } from "zod";
import { Button } from "../ui/Button";
import { Form } from "../ui/form/Form";
import { Input } from "../ui/form/Input";
import { trpc } from "../utils/trpc";
import { registerSchema } from "../utils/validation/auth";

type RegisterValues = {
  email: string;
  password: string;
  passwordConfirm: string;
};

const RegisterPage = () => {
  const router = useRouter();
  const { mutateAsync } = trpc.useMutation(["user.register"], {
    onSuccess: () => router.push("/"),
  });

  return (
    <div>
      <Form<RegisterValues, typeof registerSchema>
        onSubmit={async (values) => {
          console.log("VALUES HERE", values);
          const result = await mutateAsync(values);
        }}
        schema={registerSchema}
        options={{
          shouldUnregister: true,
        }}
      >
        {({ register, formState }) => (
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
    </div>
  );
};

export default RegisterPage;
