# Contributing

Don't edit ~email directly because it's a production app. Instead you should:

## Developing

1. Remix this

2. In your [local dev](https://github.com/FogCreek/Glitch) change `EMAIL_TEMPLATE_API` (in `puppet/hieradata/development/common.yaml`) to your remix url. Then trigger a full deploy in `sh/watch.sh` with `f`. (Don't commit this change though)

3. use paw or similar to trigger emails to your dev api. For example, POSTing to `https://api.glitch.development/email/sendLoginEmail?emailAddress=my-email@glitch.com` or `https://api.glitch.development/teams/[team-id]/sendJoinTeamEmail`.

    - You'll need to include an auth header with your request `Authorization: user-persistent-token`

4. You can see the emails sent from your dev env at [https://glitch.development/mailbox/](https://glitch.development/mailbox/)

    - To test your email templates with *real email clients* (gmail, ios mail, etc.) you'll need to use `https://api.staging.glitch.com` instead. However, staging can only send email to whitelisted addresses, so ask DavidH to add your email(s) to the staging environment SES whitelist.

## Deploying

Since this is a small microservice app with infrequent updates, the process is less hardcore than ~Community. 

1. Let everyone in #infrastructure know that you're working on email app updates, and make you know who else is working on it

2. Use the `swapDomains` api endpoint to make your remixed email app the new prod one. This part is the same as on ~Community

> This endpoint is undocumented. If you've never used it before, feel free to ask Jude, Pirijan or Emanuele for help

3. Use `Advanced Options → Export to Github` to `FogCreek/email`. Then merge in the PR that's created

💌