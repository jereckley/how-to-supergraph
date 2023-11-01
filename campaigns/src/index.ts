import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { gql } from "graphql-tag";
const main = async () => {
	const typeDefs = gql`
		type User {
			id: ID
			sites: [Site!]!
		}

		type Site @key(fields: "id"){
		  id: ID!
		  companionSiteId: String!
		}

		type Query {
			user(id: ID!,token: String): User
		}
	`;

	const resolvers = {
		Site: {
			__resolveReference(object: any) {
				console.log("Site resolve reference", object)
				const sites = [
					{ id: "1", companionSiteId: "21" },
					{ id: "2", companionSiteId: "22" },
					{ id: "3", companionSiteId: "23" },
					{ id: "4", companionSiteId: "24" },
				]
				return sites.find(site => site.id === object.id)
			}
		},
		Query: {
			user(_: any, data: any) {
				console.log("User resolver", data)
				// So you can run your checks for security here in users
				if (data.token === "bad") {
					throw new Error("Not authed")
				}
				return {
					id: data.id,
					sites: [
						{ id: "1", companionSiteId: "21" },
						{ id: "2", companionSiteId: "22" },
						{ id: "3", companionSiteId: "23" },
						{ id: "4", companionSiteId: "24" },
					],
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
