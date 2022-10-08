import { Button } from "../ui/Button";
import { Form } from "../ui/form/Form";
import { Input } from "../ui/form/Input";
import MainContainer from "../ui/layout/MainLayout";
import Tabs from "../ui/Tabs";
import { requireAuth } from "../utils/requireAuth";
import {
  IProfile,
  IChangePassword,
  profileSchema,
  changePasswordSchema,
} from "../utils/validation/auth";
import { trpc } from "../utils/trpc";
import { getSession, signOut, useSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import Alert from "../ui/Alert";
import { useForm } from "react-hook-form";
import { useState } from "react";

interface LayoutProps {
  title: string;
  subTitle: string;
  children: React.ReactNode;
}

interface AccountProps {
  name: string;
  email: string;
}

const Layout = ({ title, subTitle, children }: LayoutProps) => {
  return (
    <div>
      <div className="my-8 border-b border-gray-200 pb-8">
        <h3 className="mb-1 text-xl font-bold text-gray-900 tracking-wide">
          {title}
        </h3>
        <p className="text-sm text-gray-700">{subTitle}</p>
      </div>
      {children}
    </div>
  );
};

const DeleteAccount = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, mutateAsync } = trpc.useMutation(["user.delete-account"], {
    onSuccess: () => {
      console.log("SUCCESS");
    },
    onError: (error) => {
      console.log("error");
    },
  });

  return (
    <div className="border-b border-gray-200 pt-8">
      <p className="mb-4 text-lg font-bold text-gray-900 tracking-wide">
        Danger zone
      </p>
      <Alert
        trigger={
          <Button
            className="mb-8"
            variant="danger"
            onClick={() => setIsOpen(true)}
          >
            Delete Account
          </Button>
        }
        open={isOpen}
        onClose={() => setIsOpen(false)}
        callback={() => {
          mutateAsync();
          signOut({ callbackUrl: "/" });
        }}
        loading={isLoading}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be
            undone. This will permanently delete your account and remove your
            data from our servers."
      />
    </div>
  );
};

const AccountTab = ({ name, email }: AccountProps) => {
  const { isLoading, mutateAsync } = trpc.useMutation(["user.update-profile"], {
    onSuccess: () => {
      console.log("SUCCESS");
    },
    onError: (error) => {
      console.log("error");
    },
  });

  return (
    <Layout title="Profile" subTitle="Manage settings for your account">
      <div className="w-1/2">
        <Form<IProfile, typeof profileSchema>
          onSubmit={async (values) => {
            const result = await mutateAsync(values);
          }}
          schema={profileSchema}
          options={{
            defaultValues: {
              name: name,
              email: email,
            },
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
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Update
              </Button>
            </>
          )}
        </Form>
        <DeleteAccount />
      </div>
    </Layout>
  );
};

const SecurityTab = () => {
  const { isLoading, mutateAsync } = trpc.useMutation(
    ["user.change-password"],
    {
      onSuccess: () => {
        console.log("SUCCESS");
      },
      onError: (error) => {
        console.log("error", error);
      },
    },
  );

  return (
    <Layout title="Security" subTitle="Manage your password for your account">
      <div className="w-1/2">
        <Form<IChangePassword, typeof changePasswordSchema>
          onSubmit={async (values) => {
            const result = await mutateAsync(values);
          }}
          schema={changePasswordSchema}
          options={{
            shouldUnregister: true,
          }}
        >
          {({ register }) => (
            <>
              <Input
                label="Old password"
                type="password"
                name="oldPassword"
                placeholder="Old password"
                registration={register("oldPassword")}
              />
              <Input
                label="New password"
                type="password"
                name="newPassword"
                placeholder="New secure password"
                registration={register("newPassword")}
              />
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Update
              </Button>
            </>
          )}
        </Form>
      </div>
    </Layout>
  );
};

const BillingTab = () => {
  return (
    <Layout title="Billing" subTitle="Manage settings for your account">
      Password content
    </Layout>
  );
};

export const getServerSideProps = requireAuth(
  async (ctx: GetServerSidePropsContext) => {
    const { req } = ctx;
    const session = await getSession({ req });

    return {
      props: {
        name: session?.user?.name,
        email: session?.user?.email,
      },
    };
  },
);

const Settings = ({ name, email }: any) => {
  return (
    <MainContainer>
      <div className="mx-auto w-3/5">
        <Tabs
          tabs={[
            {
              title: "My account",
              value: "my-account-tab",
              content: <AccountTab name={name ?? ""} email={email ?? ""} />,
            },
            {
              title: "Security",
              value: "security-tab",
              content: <SecurityTab />,
            },
            {
              title: "Billing",
              value: "billing-tab",
              content: <BillingTab />,
            },
          ]}
        />
      </div>
    </MainContainer>
  );
};

export default Settings;
