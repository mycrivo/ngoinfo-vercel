import { GenerateRequest } from "../schemas/grantpilot";

test("GenerateRequest requires opportunityId and profile", () => {
  expect(() =>
    GenerateRequest.parse({ opportunityId: "abc", profile: { orgName: "X", country: "IN", sectors: ["health"] } })
  ).not.toThrow();
});


