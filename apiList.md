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

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requesId
- POST /request/review/rejected/:requesId

##userRouter

- GET /user/connections
- GET /user/request
- GET /user/feed
