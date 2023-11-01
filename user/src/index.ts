import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from '@apollo/subgraph';
import { gql } from "graphql-tag";
const main = async () => {
	const typeDefs = gql`
		enum ActiveStatus {
			SOON
			ACTIVE
			DEACTIVATED
		}
		type Site @key(fields: "id") {
			id: ID!
			name: String
			status: ActiveStatus
			location: String
			participants: [Participant!]!
		}
		
		type Participant {
			id: ID!
			firstName: String!
			lastName: String!
			site: Site!
		}
		
		type Query {
			getSite(id: ID!): Site
		}
	`;

	const resolvers = {
		ActiveStatus: {
			SOON: "SOON",
			ACTIVE: "ACTIVE",
			DEACTIVE: "DEACTIVE"
		},
		Participant: {
			site: async (parent: any, args: any, context: any, info: any) => {
				console.log("Participant site resolver");
				return [
					{ id: "1", name: "foo", location: "moo", activeStatus: "ACTIVE" },
					{ id: "2", name: "boo", location: "sue", activeStatus: "ACTIVE"  },
					{ id: "3", name: "noo", location: "too" , activeStatus: "ACTIVE" },
					{ id: "4", name: "rue", location: "poo", activeStatus: "ACTIVE"  },
				].filter((s) => parent.siteId === s.id)[0]
				
			}
		},
		Site: {
			name: (parent: any) => {
				console.log("Site name resolver");
				return parent.name.toUpperCase();
			},
			location: (parent: any) => {
				console.log("Site location resolver");
				return parent.location === "moo" ? "ohio" : "alaska";
			},
			status: (parent: any) => {
				console.log("Site status resolver");
				return parent.activeStatus;
			},
			participants: async (parent: any, args: any, context: any, info: any) => {
				console.log("Site participants resolver");
				return [
					{ id: "1", firstName: "foo", lastName: "moo", siteId: "1" },
					{ id: "2", firstName: "boo", lastName: "sue", siteId: "2" },
					{ id: "3", firstName: "noo", lastName: "too", siteId: "3" },
					{ id: "4", firstName: "rue", lastName: "poo", siteId: "4" },
				]
					.filter(
						(s) =>
							s.id ===
							parent.id
					)
					.map((s) => {
						return s;
					});
			},
			__resolveReference(siteRepresentation: any) {
				console.log("Site resolve reference", siteRepresentation)
				return [
					{ id: "1", name: "foo", location: "moo", activeStatus: "ACTIVE"},
					{ id: "2", name: "boo", location: "sue", activeStatus: "ACTIVE"},
					{ id: "3", name: "noo", location: "too", activeStatus: "ACTIVE"},
					{ id: "4", name: "rue", location: "poo", activeStatus: "ACTIVE"},
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
					{ id: "1", name: "foo", location: "moo", activeStatus: "ACTIVE" },
					{ id: "2", name: "boo", location: "sue", activeStatus: "ACTIVE"  },
					{ id: "3", name: "noo", location: "too", activeStatus: "ACTIVE"  },
					{ id: "4", name: "rue", location: "poo", activeStatus: "ACTIVE"  },
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
