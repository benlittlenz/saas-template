import { useSession } from "next-auth/react";
import { Sidebar } from "../ui/layout/Shell";
import { requireAuth } from "../utils/requireAuth";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

const DashboardPage = () => {
  const data = useSession();

  return (
    <div>
      <Sidebar />
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content">
          <div className="max-w-lg">
            <h1 className="text-5xl text-center font-bold leading-snug text-gray-400">
              You are logged in!
            </h1>
            <p className="my-4 text-center leading-loose">
              You are allowed to visit this page because you have a session,
              otherwise you would be redirected to the login page.
            </p>
            <div className="my-4 bg-gray-700 rounded-lg p-4">
              <pre>
                <code>{JSON.stringify(data, null, 2)}</code>
              </pre>
            </div>
            <a href="/api/upgrade">Upgrade here!</a>
            <div className="text-center">
              <button className="btn btn-secondary">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
