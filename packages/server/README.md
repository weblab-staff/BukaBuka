# Bukabuka Server

The server is in charge of checking the questions doc and inform Buka buka when students ask a new question. 

## Design

### Checking for questions
Finding how many questions are in a google doc will be done using regex (This should probably be fine?). We can check when a google doc changes by:  

1) Use [Google Drive Webhooks](https://medium.com/swlh/google-drive-push-notification-b62e2e2b3df4) to detect whenever the questions doc changes. Sadly, this requires the domain name to be verified by Google, which will take some time if we use Heroku or Athena servers.

2) Check every X minutes to see if the content has changed. 

3) Check every X minutes to see if the content has changed **only when there is someone on the site**. We can keep track of how many people are on the site by using websockets, if the count ever hits zero, we don't have to check.

Whenever the number of questions changes, we can emit a "questionAdded" event to all sockets.

## Keeping track of Google Docs.

We only want to check questions for a specific day, since Bukabuka doesn't care about the past. 
To decide which file to check, we will simply use the latest file modified in the questions doc folder - this is yank but should be fine. 
