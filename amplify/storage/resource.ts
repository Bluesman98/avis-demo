import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "bucket",
  access: (allow) => ({
    "Pdf_Storage/*": [
      allow.authenticated.to(["read", "write", "delete"]),
      //allow.guest.to(['read','write','delete']),
    ],
  }),
});
