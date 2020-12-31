# Public Routes

**Get happiness**
---
*Request*

`GET /api/happiness`

No params.

*Response*

`{ happiness: float }`


**Get question**
---
*Request*

Buka buka might be confused, let's ask.

`GET /api/question`

No params

*Response*

`{ question: string }`

If buka buka has no questions, it will return whatever buka buka is thinking about.


# Admin Routes
**Set happiness**
---
*Request*

`POST /api/happiness`

Required Params:


`happiness` - A float from 0 to 1


`pwd` - The admin password


*Response*

Empty

**Set question**
---
Buka buka is always asking questions. If you want buka buka to ask a particular question, let buka buka know. This might be useful when we get participation on zoom or google docs becomes unusable. 

*Request*

`POST /api/question`

Required Params:


`question` - String with the question
`pwd` - The admin password

*Response*

Empty 

**Wake up buka buka**
---
When lecture starts, staff should wake up buka buka. It'll be a shame to miss lecture. 

By making this request we initialize the happiness decay rate and start making requests to the google docs api. 

*Request*

`POST /api/wakeup`

Required Params:

`pwd` - The admin password

*Response*

`200` Status code if successfully found and parsed the questions doc. `500` otherwise.

**Rest**
---
Since lecture is over, this resets buka buka's happiness to 0.5  and stops checking the google doc.

*Request*

`POST /api/rest`

Required Params:

`pwd` - The admin password

*Response*

Empty
