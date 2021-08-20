// make sure api is up and running before running this test
import dotenv from 'dotenv'
dotenv.config()
import assert from 'assert';
import { GraphQLClient } from 'graphql-request'

function gqQuery(query, variables) {
  const client = new GraphQLClient(`http://localhost:${process.env.PORT}/graphql`, {
    method: 'POST',
    credentials: 'include'
  });

  return client.request(query, variables);
}

describe('Posts', function() {
  describe('getPosts()', function() {
    it('should get all posts', async function () {
      let data

      data = await gqQuery(`query {
        posts {
          _id
          title
          votes
        }
      }`)

      const posts = data.posts

      assert.equal(posts.constructor, Array);
    });
  });

  describe('getPost()', function() {
    it('should get one post', async function() {
      let data
      let post

      data = await gqQuery(`query {
        posts {
          _id
          title
          votes
        }
      }`)


      post = data.posts[0]

      if (post) {
        let postId = post._id

        data = await gqQuery(`query {
          post(_id: "${postId}") {
            _id
            title
            votes
          }
        }`)
        
        post = data.post
      
        assert.equal(post.constructor, Object);
      }
    });
  });
});

describe('Authors', function() {
  describe('getAuthors()', function() {
    it('should get all authors', async function () {
      let data

      data = await gqQuery(`query {
        authors {
          _id
          firstName
          lastName
        }
      }`)

      const authors = data.authors

      assert.equal(authors.constructor, Array);
    });
  });

  describe('getAuthor()', function() {
    it('should get one author', async function() {
      let data
      let author

      data = await gqQuery(`query {
        authors {
          _id
          firstName
          lastName
        }
      }`)


      author = data.authors[0]

      if (author) {
        let authorId = author._id

        data = await gqQuery(`query {
          author(_id: "${authorId}") {
            _id
            firstName
            lastName
          }
        }`)
        
        author = data.author
      
        assert.equal(author.constructor, Object);
      }
    });
  });
});
