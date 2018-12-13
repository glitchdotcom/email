Email Templates
=============

This is a Glitch microservice that creates the **transactional emails** that get sent to users, in response to user actions like:
- inviting a user to a team
- inviting a user to a project
- attempting to log into Glitch in via email

We're using a microservice because these user actions can come from the editor or community site, and because the API is not a great place to create, update, and preview templates

![email lyfe](https://media.giphy.com/media/YmjleYhDTUiYw/giphy.gif)

How it Works
------------
- Recieves input from the Glitch API (tokens, strings, emailType)
- Email app verifies that the request is from the API
- Email app compiles the email HTML from templates
- Sends the compiled html email and intended recipients to the API
- API sends the email out via Amazon SES
