#DevTinder API List

##authRouter

- POST /singup
- POST /login
- POST /logout

##profileRouter

- GET /profile/view
- GET /profile/edit
- GET /profile/password

##connectionRequestRouter

- POST /request/send/:status/:toUserId
- POST /request/review/:status/:requesId

##userRouter

- GET /user/request/received
- GET /user/connections
- GET /user/feed
