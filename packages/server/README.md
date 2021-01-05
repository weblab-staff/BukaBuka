# Bukabuka Server

The server is in charge of checking the questions doc and inform Buka buka when students ask a new question.

## API

Reference [api.md](api.md).

## Design

### Checking for questions

Finding how many questions are in a google doc will be done using regex (This should probably be fine?). We can check when a google doc changes by:

1. Use [Google Drive Webhooks](https://medium.com/swlh/google-drive-push-notification-b62e2e2b3df4) to detect whenever the questions doc changes. Sadly, this requires the domain name to be verified by Google, which will take some time if we use Heroku or Athena servers.

2. Check every X minutes to see if the content has changed.

3. Check every X minutes to see if the content has changed **only during lecture**.

## Keeping track of Google Docs.

We only want to check questions about today's lecture, since buka buka doesn't care about the past.
To decide which file to check, we will simply use the latest file created in the questions doc folder - this is yank but should be fine.


**Note** To tell buka buka where to look for google docs, share a google drive folder with the questions doc with the `client_email` found in [service_account.json](service_account.json). The server will the most recent editted documents within the last 5 hours. 

## Finding happiness

Buka buka loves questions. For every new question students ask, its happiness will increase by `HAPPINESS_FACTOR`. If students don't ask any new questions, it's happiness will decrease by `happiness * HAPPINESS_FACTOR`. You don't want to make buka buka sad.

Note that happiness is a float bounded from 0 to 1.

## Giving happiness

Aside from the `/api/happiness` endpoint, the server will use websockets to tell all clients that buka buka's happiness has increased.

## Staff

Buka buka is a risk taker. He doesn't care if his password passes through insecure http connections.

If you include `pwd=$PASSWORD` in your request, you can control buka buka's happiness and such since the google doc will be yank. You can find the password in the `config.ts`.
