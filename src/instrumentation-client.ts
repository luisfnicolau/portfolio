import { initBotId } from "botid/client/core";

// Invisible bot check for the Ask chat: requests to these paths carry a challenge token that
// checkBotId() verifies in the route handler.
initBotId({ protect: [{ path: "/api/ask", method: "POST" }] });
