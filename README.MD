# Restaurants

## Api

### POST /authentication/register
**Body Example**
```json
{
	"name": "Mateo Devia",
	"username": "mateo",
	"email": "mateodevia@hotmail.com",
	"password": "12345678"
}
```

**Response Example**
```json
{

	"id": "c1378b9f-6d8c-46d3-b968-20256fe88235",
	"name": "Mateo Devia",
	"username": "mateo",
	"email": "mateodevia@hotmail.com",
	"updatedAt": "2021-05-16T00:57:15.701Z",
	"createdAt": "2021-05-16T00:57:15.701Z"

}
```

### POST /authentication/login
**Body Example**
```json
{

	"email": "mateodevia@hotmail.com",
	"password": "12345678"

}
```

**Response Example**
```json
{

	"id": "c1378b9f-6d8c-46d3-b968-20256fe88235",
	"name": "Mateo Devia",
	"username": "mateo",
	"email": "mateodevia@hotmail.com",
	"updatedAt": "2021-05-16T00:57:15.701Z",
	"createdAt": "2021-05-16T00:57:15.701Z"

}
```

### GET /restaurants
❗️Requires JWT as Bearer token

**Query by Location  Example**
http://localhost:3000/restaurants?lat=4.698837&long=-74.036449&type=LOCATION

**Query by City  Example**
http://localhost:3000/restaurants?type=CITY&city=Bogota


### GET /transactions

**Response Example**
```json
[
	{
		"id": "e27b1119-1874-4552-affc-61ae04ef344c",
		"action": "REGISTER",
		"info": {
			"name": "Jaylen",
			"username": "Toby.Kirlin",
			"email": "Sage.Zulauf46@yahoo.com"
		},
	"userId": "be13161c-4660-4931-afab-2aabd576729a",
	"createdAt": "2021-05-16T00:54:21.033Z",
	"updatedAt": "2021-05-16T00:54:21.033Z",
	"user": {
		"name": "Jaylen",
		"username": "Toby.Kirlin",
		"email": "Sage.Zulauf46@yahoo.com"
	}
]
```