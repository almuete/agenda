import { useState } from "react";

const Login = ({ ...props }) => {
  const [gqlUrl, setGqlUrl] = useState(
    "https://api-dev.pulse.outsourced.ph/graphql"
  );

  const [bearer, setBearer] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e: any) => {
    e.preventDefault();

    const mutationQuery = `
        mutation {
            login(email: "${email}", password: "${password}") {
              token
            }
        }
      `;
    fetch(gqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: mutationQuery,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json(); // Parse the response JSON
      })
      .then((data) => {
        setBearer(data.data.login.token);
        console.log("Bearer ", data.data.login.token);
      })
      .catch((error) => {
        console.error("Error executing GraphQL mutation:", error);
      });
  };
  return (
    <>
      <div className="min-h-screen">
        <div className={"absolute w-full"}>
          <div className="flex justify-between p-4 xl:py-[30px] xl:px-[40px]">
            <div>
              <img src={"/images/logo.svg"} draggable="false" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center items-center w-full min-h-screen gradient-login">
          <div className="w-full xl:w-1/2 ">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-[30px] text-2xl xl:text-[40px] font-medium text-center text-navy">
                Welcome!
              </h2>
              <p
                className={
                  "font-regular text-2xl text-navy text-center mb-[30px]"
                }
              >
                Sign in to view your Outsourced Pulse dashboard
              </p>
              {bearer && (
                <div className="text-center text-xl py-4">Bearer {bearer}</div>
              )}
              <div className="max-w-[423px] mx-auto p-10 bg-gradient-to-tr from-cyan-2 to-cyan rounded-[20px] hover:shadow-login focus:shadow-login transition-shadow mb-[30px]">
                <form
                  onSubmit={(e) => handleSubmit(e)}
                  noValidate
                  className={"flex flex-col gap-2"}
                >
                  <div>
                    <input
                      className={
                        "font-regular bg-gray-50 border border-gray-2 text-gray-900 text-sm xl:text-[15px] rounded block w-full py-3 px-4 focus:outline-none focus:border-navy transition xl:text-sm"
                      }
                      type={"email"}
                      placeholder={"Email"}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <input
                      className={
                        "font-regular bg-gray-50 border border-gray-2 text-gray-900 text-sm xl:text-[15px] rounded block w-full py-3 px-4 focus:outline-none focus:border-navy transition xl:text-sm"
                      }
                      type={"password"}
                      placeholder={"Password"}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className={"mt-2"}>
                    <button className="btn btn-navy rounded-full btn-full text-lg font-cerapro ">
                      <div className="flex items-center">
                        <div className="block w-full">Log in</div>
                      </div>
                    </button>
                  </div>
                </form>
              </div>
              <p className={"text-center text-navy text-sm underline"}>
                <a href="/forgot-password">Forgot password?</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
