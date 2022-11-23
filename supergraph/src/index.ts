import {ApolloGateway, IntrospectAndCompose} from "@apollo/gateway";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
const main = async () => {
	const gateway = new ApolloGateway({
		supergraphSdl: new IntrospectAndCompose({
			subgraphs: [
				{
					name: "users",
					url: "http://localhost:4002",
				},
				{
					name: "campaigns",
					url: "http://localhost:4003",
				},
			],
		}),
	});

	const server = new ApolloServer({
		gateway
	});

	// Note the top-level await!
	const { url } = await startStandaloneServer(server, {
		listen: { port: 4000 },
	});
	console.log(`🚀  Server ready at ${url}`);
};

main();
