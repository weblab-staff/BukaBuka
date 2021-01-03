# Public Routes

## **Get happiness**

_Request_

`GET /api/happiness`

No params.

_Response_

`{ happiness: float }`

## **Get question**

_Request_

Buka buka might be confused, let's ask.

`GET /api/question`

No params

_Response_

`{ question: string }`

If buka buka has no questions, it will return whatever buka buka is thinking about.

# Admin Routes
## **Wake up buka buka**
This will start the cron job that updates the happiness every minute.

_Request_

`POST /api/wakeup`

Required Params:

`pwd` - The admin password

_Response_

Empty

## **Stop updating happiness**
When class is over, stop the cron job so we don't waste resources.

_Request_

`POST /api/sleep`

Required Params:

`pwd` - The admin password

_Response_

Empty

## **Set happiness**

_Request_

`POST /api/happiness`

Required Params:

`happiness` - A float from 0 to 1

`pwd` - The admin password

_Response_

Empty

## **Set question**

Buka buka is always asking questions. If you want buka buka to ask a particular question, let buka buka know. This might be useful when we get participation on zoom or google docs becomes unusable.

_Request_

`POST /api/question`

Required Params:

`question` - String with the question
`pwd` - The admin password

_Response_

Empty

## **Wake up buka buka**

When lecture starts, staff should wake up buka buka. It'll be a shame to miss lecture.

By making this request we initialize the happiness decay rate and start making requests to the google docs api.

_Request_

`POST /api/wakeup`

Required Params:

`pwd` - The admin password

_Response_

`200` Status code if successfully found and parsed the questions doc. `500` otherwise.

## **Rest**

Since lecture is over, this resets buka buka's happiness to 0.5 and stops checking the google doc.

_Request_

`POST /api/rest`

Required Params:

`pwd` - The admin password

_Response_

Empty
