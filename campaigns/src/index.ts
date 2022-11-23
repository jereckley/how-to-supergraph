import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { gql } from "graphql-tag";
const main = async () => {
	const typeDefs = gql`
		type Campaign {
			id: ID
			participants: [Participant]
		}

		type Participant @key(fields: "id") {
			id: ID!
		}

		type Query {
			participant(id: ID!,token: String): Participant
			campaign(id: ID!,token: String): Campaign
		}
	`;

	const resolvers = {
		Participant: {
		},
		Query: {
			participant(_:any,data:any) {
				// So you can run your checks for security here in campaigns
				// In the case Jennifer mentioned you would check to see if this participant has an active fundraiser
				// If you throw an error here the part that lives in user directory will not resolve
				if(data.token === "bad") {
					throw new Error("Not authed")
				}
				return { id: data.id};
			},
			campaign(_:any, data:any) {
				// So you can run your checks for security here in campaigns
				// In the case Jennifer mentioned you would just check to see if the user is a group leader
				if(data.token === "bad") {
					throw new Error("Not authed")
				}
				return {
					id: data.id,
					participants: [{id:"1"}, {id:"2"}, {id:"3"}, {id:"4"}],
				};
			},
		},
	};

	const server = new ApolloServer({
		schema: buildSubgraphSchema({ typeDefs, resolvers }),
	});

	// Note the top-level await!
	const { url } = await startStandaloneServer(server, {
		listen: { port: 4003 },
	});
	console.log(`🚀  Server ready at ${url}`);
};

main();
