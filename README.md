# blog

blog-REST-apis

1. npm install

2. npm run dev

# API end points

## POST-Create new blog

1. http://localhost:4000/api/v1/blogs/create

In body
{
blogTitle, blogBody
}

## GET-Get all blogs

2. http://localhost:4000/api/v1/blogs

## GET-Get single blog details

3. http://localhost:4000/api/v1/blogs/:blogId

In params
{
blogId (\_id)
}

## PATCH-Update Blog Details

4. http://localhost:4000/api/v1/blogs/:blogId

In params
{
blogId (\_id)
}

In body
{
blogTitle, blogBody
}

## PATCH-Create new comment

5. http://localhost:4000/api/v1/blogs/comment/:blogId

In params
{
blogId (\_id)
}

In body
{
email, comment
}

## PATCH-Reply for a comment

6. http://localhost:4000/api/v1/blogs/:blogId/comment/:commentId/reply

In params
{
blogId (\_id), commentId
}

In body
{
email, reply
}
