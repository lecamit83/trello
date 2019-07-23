# Trello fake api

## Installation

``` bash
$ npm install 
```
 - Configure environment variable in .env file like .env.example.sh
## Running

``` bash
$ npm start 
```

## Using
 - User
    - Create Account
    ```
    METHOD : POST
    http://localhost:${PORT}/api/users/register
    
    body : {
      'name' : 'Than Toan Doc',
      'email': 'thantoandoc83@gmail.com',
      'password' : '123456'
    }
    ```
    - Login
     ```
    METHOD : POST
    http://localhost:${PORT}/api/users/login
    
    body : {
      'email': 'thantoandoc83@gmail.com',
      'password' : '123456'
    }
    ```
    - Get Profile
     ```
      METHOD : GET
      http://localhost:${PORT}/api/users/profile/me

      body : {

      }
    ```
    - Update Name
     ```
     METHOD : PATCH
      http://localhost:${PORT}/api/users/profile/me

      body : {
        'name' : 'Le Cam',
      }
    ```
    - Upload Avatar
    ``` html
     METHOD : PUT
      http://localhost:${PORT}/api/users/profile/me/avatar

      <form action="/profile" method="post" enctype="multipart/form-data">
        <input type="file" name="avatar" />
      </form>
    ```
    - Logout
    ```
    METHOD : POST
    http://localhost:${PORT}/api/users/logout
    
    body : {
      
    }
    ```
 - Board 
    - Get Boards
    ```
    METHOD : GET
    http://localhost:${PORT}/api/boards
    
    body : {
     
    }
    ```
    - Get Board
    ```
    METHOD : GET
    http://localhost:${PORT}/api/boards/${boardId}
    
    body : {
     
    }
    ```
    - Create Board
    ```
    METHOD : POST
    http://localhost:${PORT}/api/boards
    
    body : {
      'title' : 'Title Board',
    }
    ```
    - Update Title Board
     ```
    METHOD : PATCH
    http://localhost:${PORT}/api/boards/${boardId}
    
    body : {
      'title' : 'Name Board',
    }
    ```
    - Delete Board
    ```
    METHOD : DELETE
    http://localhost:${PORT}/api/boards/${boardId}
    
    body : {
     
    }
    ```
    - Invite Member into Board
    ```
    METHOD : POST
    http://localhost:${PORT}/api/members
    
    body : {
      'boardId' : 'ID of board which you want to invite someone',
      'email' : 'email of user whom you want to invite'
    }
    ```
    
    - Remove Member in Board
    ```
    METHOD : POST
    http://localhost:${PORT}/api/members/${memberId}
    
    body : {
      'boardId' : 'ID of board which you want to REMOVE someone',
    }
    ```
    
    - Update Member Permission in Board
    ```
    METHOD : PATCH
    http://localhost:${PORT}/api/members/${memberId}
    
    body : {
      'boardId' : 'ID of board which you want to REMOVE someone',
      'permission' : value? if(value === admin) ? true : false
    }
    ```
 - List 
    - Create List
     ```
    METHOD : POST
    http://localhost:${PORT}/api/list
    
    body : {
      'boardId' : 'ID of board which you want to create List',
      'title' : 'List Title'
    }
    ```
    - Remove List
     ```
    METHOD : DELETE
    http://localhost:${PORT}/api/list/${listId}
    
    body : {
      'boardId' : 'ID of board which you want to DELETE List'
    }
    ```
    - Update Title List
     ```
    METHOD : PATCH
    http://localhost:${PORT}/api/list/${listId}
    
    body : {
      'boardId' : 'ID of board which you want to UPDATE List',
      'title' : 'new List Title'
    }
    ```
 - Card
    - Get Card
    ```
    METHOD : GET
    http://localhost:${PORT}/api/cards/${cardId}
    
    body : {
      'boardId' : 'ID of board which you want to READ Card',
      'listId' : 'ID of List which you want to READ Card'
    }
    ```
    - Create Card
    
    ```
    METHOD : POST
    http://localhost:${PORT}/api/cards    
    body : {
      'boardId' : 'ID of board which you want to CREATE Card',
      'listId' : 'ID of List which you want to CREATE Card',
      'title' : 'Card Title'
    }
    ```
    - Update Title Card
    
    ```
    METHOD : PATCH
    http://localhost:${PORT}/api/cards/${cardId}
    body : {
      'boardId' : 'ID of board which you want to Update Card',
      'listId' : 'ID of List which you want to UPDATE Card',
      'title' : 'Card Title'
    }
    ```
    - Delete Card
    
    ```
    METHOD : DELETE
    http://localhost:${PORT}/api/cards/${cardId}    
    body : {
      'boardId' : 'ID of board which you want to DELETE Card',
      'listId' : 'ID of List which you want to DELETE Card',
    }
    ```
    - Invite Member INTO Card
     ```
    METHOD : POST
    http://localhost:${PORT}/api/cards/${cardId}/members
    body : {
      'boardId' : 'ID of board which you want to INVITE someone into Card',
      'listId' : 'ID of List which you want to INVITE someone into Card',
      'email' : 'xyz@gmail.com'
    }
    ```
    - Remove Member in Card
     ```
    METHOD : DELETE
    http://localhost:${PORT}/api/cards/${cardId}/members/${memberId}
    body : {
      'boardId' : 'ID of board which you want to REMOVE someone in Card',
      'listId' : 'ID of List which you want to REMOVE someone in Card',
    }
    ```
    - Add Comment
    ```
    METHOD : POST
    http://localhost:${PORT}/api/cards/${cardId}/comments
    body : {
      'boardId' : 'ID of board which you want to ADD comments into Card',
      'listId' : 'ID of List which you want to ADD comments into Card',
    }
    ```
    - Update Comment
     ```
    METHOD : PATCH
    http://localhost:${PORT}/api/cards/${cardId}/comments/${index}
    body : {
      'boardId' : '----------------',
      'listId' : ' ---------------',
    }
    ```
    - Remove Comment
     ```
    METHOD : DELETE
    http://localhost:${PORT}/api/cards/${cardId}/comments/${index}
    body : {
      'boardId' : '----------------',
      'listId' : ' ---------------',
    }
    ```
    - Add Header Task
     ```
    METHOD : POST
    http://localhost:${PORT}/api/cards/${cardId}/tasks
    body : {
      'boardId' : '----------------',
      'listId' : ' ---------------',
      'title' : 'Task Title'
    }
    ```
    - Add Sub Task
    ```
    METHOD : POST
    http://localhost:${PORT}/api/cards/${cardId}/tasks/${taskId}
    body : {
      'boardId' : '----------------',
      'listId' : ' ---------------',
      'title' : 'Content Task Title'
    }
    ```
    - Remove SubTask
   ```
    METHOD : DELETE
    http://localhost:${PORT}/api/cards/${cardId}/tasks/${taskId}/contents/${index}
    body : {
      'boardId' : '----------------',
      'listId' : ' ---------------',
    }
    ```
    - Remove Header Task
    
     ```
    METHOD : DELETE
    http://localhost:${PORT}/api/cards/${cardId}/tasks/${taskId}
    body : {
      'boardId' : '----------------',
      'listId' : ' ---------------',
    }
    ```
    - Add DueTime
     ```
    METHOD : POST
    http://localhost:${PORT}/api/cards/${cardId}/duetime
    body : {
      'boardId' : '----------------',
      'listId' : ' ---------------',
      'dueTime' : (value) ?? value has format 'mm/dd/yyyy'
    }
    ```
    - Remove DueTime
     ```
    METHOD : DELETE
    http://localhost:${PORT}/api/cards/${cardId}/duetime
    body : {
      'boardId' : '----------------',
      'listId' : ' ---------------',
    }
    ```
    - Add Description
    ```
    METHOD : POST
    http://localhost:${PORT}/api/cards/${cardId}/description
    body : {
      'boardId' : '----------------',
      'listId' : ' ---------------',
      'description' : (value) 
    }
    ```
    - Remove Description
    ```
    METHOD : DELETE
    http://localhost:${PORT}/api/cards/${cardId}/decription
    body : {
      'boardId' : '----------------',
      'listId' : ' ---------------',
    }
    ```
    
    ## Library
    1. [express](https://expressjs.com/)
    2. [body-parser](https://www.npmjs.com/package/body-parser)
    3. [dotenv](https://github.com/motdotla/dotenv)
    4. [bcrypt](https://www.npmjs.com/package/bcrypt) 
    5. [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
    6. [mongoose](https://mongoosejs.com/)
    7. [morgan](https://www.npmjs.com/package/morgan)
    8. [multer](https://www.npmjs.com/package/multer)
    9. [validator](https://www.npmjs.com/package/validator)
