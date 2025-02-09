import { createClient } from "meteor-rpc";
import { Server } from "/server/main";

export const rpcApiClient = createClient<Server>();
