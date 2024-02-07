# REST based JSON mock server
## Posts data model
* id : Unique Integer
* title : String
* author : String
* views : Integer
* reviews : Integer
## Author data model
* id : Unique Integer
* first_name : String
* last_name : String
* posts : Integer

# End Points
## GET /posts
Returns all posts  
Example:  
GET/posts  
```
[
    {      
        "id":1,
        "title":"title1",
        "author":"author1",
        "views":123,
        "reviews":23   
    },
    {
        "id":2,
        "title":"title2",
        "author":"author2",
        "views":321,
        "reviews":29
    }
]
```
## GET posts/:id
Returns post which has the given id  
Notes:  
* Returns message if no post with that id exists  

Example:  
GET/posts/1
```
[
    {      
        "id":1,
        "title":"title1",
        "author":"author1",
        "views":123,
        "reviews":23   
    }
]
```
## POST /posts
Can add a post  
Notes:  
* If id is not provided a unique id is given to the post  
*  If a post with the same id exists it gives the message  "A book with the same id already exists."


## DELETE /posts/:id
Can delete a post with that id  
Notes:  
* If no post with that id exists it gives the message "Post not found."