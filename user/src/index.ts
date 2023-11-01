import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from '@apollo/subgraph';
import { gql } from "graphql-tag";
const main = async () => {
	const typeDefs = gql`
		type Site @key(fields: "id") {
			id: ID!
			name: String
			location: String
		}
		
		type Query {
			getSite(id: ID!): Site
		}
	`;

	const resolvers = {
		Site: {
			__resolveReference(siteRepresentation: any) {
				console.log("Site resolve reference", siteRepresentation)
				return [
					{ id: "1", name: "foo", location: "moo" },
					{ id: "2", name: "boo", location: "sue" },
					{ id: "3", name: "noo", location: "too" },
					{ id: "4", name: "rue", location: "poo" },
				]
					.filter(
						(s) =>
							s.id ===
							siteRepresentation.id
					)
					.map((s) => {
						return s;
					})[0];
			},
		},
		Query: {
			getSite: async (parent: any, args: any, context: any, info: any) => {
				console.log("getSite resolver", args);
				return [
					{ id: "1", name: "foo", location: "moo" },
					{ id: "2", name: "boo", location: "sue" },
					{ id: "3", name: "noo", location: "too" },
					{ id: "4", name: "rue", location: "poo" },
				]
					.filter(
						(s) =>
							s.id ===
							args.id
					)
					.map((s) => {
						return s;
					})[0];
			}
		}
	};

	const server = new ApolloServer({
		schema: buildSubgraphSchema({ typeDefs, resolvers })
	});

	// Note the top-level await!
	const { url } = await startStandaloneServer(server, {
		listen: { port: 4002 },
	});
	console.log(`🚀  Server ready at ${url}`);
};

main();
