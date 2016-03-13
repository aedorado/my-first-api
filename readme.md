#### SAMPLE API IN NODEJS & MONGODB

API built in nodejs & mongodb using express, mongoose & bodyparser.
The app assumes mongodb is configured to use port number `27017`.

Perform the following steps:

1. Clone the repo locally and run `npm install` to install all dependencies.

2. Run comman `node server.js` to start the socket server. Server will start on port `3000`

3. Using some tools such as cURL or REST API extensions for web browsers test the API mothods.


#### The details about the API methods are as follows:

i)
`GET http://localhost:3000/api/request?connId=19&timeout=80`
runs the request for timeout time and returns `{status:"OK"}` thereafter.
If there is already a request with the given connId it return connId `{status: "Connection Id already exists."}`
If it was killed before completion, it return `{status: "Process killed prematurely."}`

ii)
`PUT http://localhost:3000/api/kill` with payload such as `{connId: 179}`
Kills the request with the given id and return `{status:"OK"}`
If no such id exists, it return `{status: "Invalid connection Id"}`

iii)
`GET http://localhost:3000/api/serverStatus`
Returns the id and the time until timeout of all requests which have not timedout yet in the josn format as:

`[{
	"id": 1,
	"timeleft": 356
}, {
	"id": 4, 
	"timeleft": 375
}]`

