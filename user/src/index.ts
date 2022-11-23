import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from '@apollo/subgraph';
import { gql } from "graphql-tag";
const main = async () => {
	const typeDefs = gql`
		type Participant @key(fields: "id") {
			id: ID! @external
			firstName: String
			lastName: String
		}
	`;

	const resolvers = {
		Participant: {
			__resolveReference(participantRepresentation: any) {
				return [
					{ id: "1", firstName: "foo" ,lastName: "moo"},
					{ id: "2", firstName: "boo" ,lastName: "sue"},
					{ id: "3", firstName: "noo" ,lastName: "too"},
					{ id: "4", firstName: "rue" ,lastName: "poo"},
				]
					.filter(
						(s) =>
							s.id ===
							participantRepresentation.id
					)
					.map((s) => {
						return s;
					})[0];
			},
		},
	};

	const server = new ApolloServer({
		schema: buildSubgraphSchema({typeDefs, resolvers})
	});

	// Note the top-level await!
	const { url } = await startStandaloneServer(server, {
		listen: { port: 4002 },
	});
	console.log(`🚀  Server ready at ${url}`);
};

main();
