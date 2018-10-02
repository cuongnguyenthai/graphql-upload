const { ApolloServer, gql, GraphQLUpload, makeExecutableSchema } = require('apollo-server');
const azure = require('azure-storage');
const path = require('path')

const CONNECTION_STRING = "<< FILL YOUR AZURE CONNECTION STRING HERE >>"
const STORAGE = "<< FILL YOUR STORAGE NAME HERE >>"

const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
    link: String!
  }

  type Query {
    hi: String!
  }

  type Mutation {
    uploadFile(file: Upload!): File!
  }
`;

const resolvers = {
    Upload: GraphQLUpload,
    Query: {
        hi: () => "Hello"
    },
    Mutation: {
        async uploadFile(parent, { file }) {
            const { stream, filename, mimetype, encoding } = await file;
            let blobService = azure.createBlobService(CONNECTION_STRING);
            let containerName = 'images';
            let extname = path.extname(filename);
            let resolveName = path.basename(filename, extname) + '-' + Date.now().toString() + extname;
            let upload = new Promise((resolve, reject) => {
                blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'container' }, (error, result, response) => {
                    if (!error) {
                        blobService.createBlockBlobFromStream(containerName, resolveName, stream, stream._readableState.length,
                            function (error, result, response) {
                                if (!error) {
                                    const link = `https://${STORAGE}.blob.core.windows.net/${result.container}/${result.name}`;
                                    resolve(link);
                                }
                            });
                    }
                })
            });
            await upload.then(res => link = res, error => console.log(error))
            return { stream, filename, mimetype, encoding, link };
        }
    }
}

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
    schema,
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});