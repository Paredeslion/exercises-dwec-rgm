// Lo que se manda al servidor
/* {
"description": "Robot",
"photo": "Image in base64"
}*/ 
export interface PresentInsert {
	description: string;
	photo: string;
}

// Data from server
/* 
{
"presents.": [{
"id": 3,
"photo": "http://localhost: 3000/img/1763371526584.webp",
"description": "Una silla"
},
{
"id":8,
"photo": "http://localhost:3000/img/1763470258109.jpeg",
"description": "Ordenador muy potente"
}]
}
*/ 
/* Present in singular is:
{
"id": 3,
"photo": "http://localhost: 3000/img/1763371526584.webp",
"description": "Una silla"
}
*/
// Is very similar to the object from PresentInsert for that we use extend
// We not declare description again because is identic to the description from PresentInsert
export interface Present extends PresentInsert {
  id: number;
  photo: string; // when receiving, it's a URL
}

/* The keys {} tells to TS that we are expecting an object
this keys are the same that the keys outside the JSON object { presents:... }
presents: ... is the critic part because the server gives us exactly "presents"
If we use "gifts:..." fails, if we use "data:..." fails
Present[] because is an array and every object inside the array must comply the present structure:
id, photo, description
*/
export interface GetPresentsResponse {
	presents: Present[];
}

/*
INTERFAZ: GetPresents              JSON (DATOS REALES)
+------------------------+         +-----------------------------+
|                        |         |                             |
|  presents: [           |  <====> |  "presents": [              |
|                        |         |                             |
|    +--------------+    |         |    { "id": 1, "desc"... },  |
|    |  Present     |    |  <====> |    { "id": 2, "desc"... },  |
|    +--------------+    |         |    { "id": 3, "desc"... }   |
|                        |         |                             |
|  ]                     |         |  ]                          |
|                        |         |                             |
+------------------------+         +-----------------------------+
 */

/* In this case, we need a singular present
{
"id": 3,
"photo": "http://localhost: 3000/img/1763371526584.webp",
"description": "Una silla"
}
The keys afeter AddPresent are the same keys from the JSON object { present:... }
We use present present because the server gives us exactly "present"
Finally, we use Present because this previous created object are exactly that we need
(id, photo, description)
*/
export interface AddPresentResponse {
	present: Present;
}

/*
INTERFAZ: AddPresent               JSON (RESPUESTA DEL SERVIDOR)
+------------------------+         +-----------------------------+
|                        |         |                             |
|  present:              |  <====> |  "present":                 |
|                        |         |                             |
|    +--------------+    |         |    {                        |
|    |  Present     |    |  <====> |      "id": 9,               |
|    |              |    |         |      "desc": "Robot"...     |
|    +--------------+    |         |    }                        |
|                        |         |                             |
+------------------------+         +-----------------------------+
*/