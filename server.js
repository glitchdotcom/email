const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const pug = require('pug');
const util = require('util');
const stylish = require('stylish');
const autoprefixer = require('autoprefixer-stylus');
const readFile = util.promisify(fs.readFile);
const juice = require('juice')

app.use(stylish({
  src: __dirname + '/public',
  setup: function(renderer) {
    return renderer.use(autoprefixer());
  },
  watchCallback: function(error, filename) {
    if (error) {
      return console.log(error);
    } else {
      return console.log(`${filename} compiled to css`);
    }
  }
}));
app.use(bodyParser.json());
app.set('views', './views')
app.set('view engine', 'pug');
app.use(express.static('public'));

// temp method
const communitySiteUrl = (path) => {
  return `https://glitch.com/@${path}`
}

const subject = (params) => {
  let template = params.template
  if (template === "email-login") {
    return "Sign in to Glitch"
  } else if (template === "join-team") {
    return `Join ${params.team.name} on Glitch`
  } else if (template === "team-deleted") {
    return `${params.teamName} Deleted`
  }
}

// template preview routes 👀

app.get("/", function (request, response) {
  response.render('index');
});

app.get("/email-login", function (request, response) {
  let testParams = {
    baseDomain: "https://glitch.com/",
    path: 'login/email',
    joinToken: 'cool-cosmos-miracle',
    title: subject({
      template: "email-login",
    }),
  }
  response.render('email-login', testParams)
});

// from post('/teams/:teamId/sendJoinTeamEmail') in api/source/teams.ts
app.get("/join-team", function (request, response) {
  let testParams = {
    team: {
      id: '74',
      name: "Glitch",
      url: 'glitch',
      hasAvatar: true
    },
    invitedUser: {
      id: '2',
      name: 'Pirijan',
      login: 'pirijan',
      avatarUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/2ea4260e-b6aa-4b23-b867-503fdcdf175d-small.png',
    },
    userWhoSentInvite: {
      id: '3',
      name: "Greg Weil",
      login: "greg",
      avatarUrl: "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/2386d05e-814f-4bd4-86d8-4f775379d74d-large.png",
    },
    joinToken: '123',
    baseDomain: "https://glitch.com/",
    title: subject({
      template: "join-team",
      team: {
        name: "Glitch",
      },
    }),
  }
  response.render('join-team', testParams)
});

app.get("/join-team-anon", function (request, response) {
  let testParams = {
    team: {
      id: '1',
      name: "Test Team",
      url: 'test-team',
      hasAvatar: false
    },
    invitedUser: {
      id: '3',
      name: "Greg Weil",
      login: "greg",
      avatarUrl: "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/2386d05e-814f-4bd4-86d8-4f775379d74d-large.png",
    },
    userWhoSentInvite: {
      id: '2',
      color: 'lime',
    },
    joinToken: '123',
    baseDomain: "https://glitch.com/",
    title: subject({
      template: "join-team",
      team: {
        name: "Test Team",
      },
    }),
  }
  response.render('join-team', testParams)
});



app.get("/team-deleted", function (request, response) {
  var userLogin = 'pirijan'
  var teamDomain = 'team-rocket'
  let testParams = {
    teamName: "Team Rocket",
    teamLink: communitySiteUrl(teamDomain),
    teamAvatarUrl: 'https://cdn.glitch.com/team-avatar/148/large?1534355095916',
    userName: 'Pirijan',
    userAvatarUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/2ea4260e-b6aa-4b23-b867-503fdcdf175d-small.png',
    userLink: communitySiteUrl(userLogin),
    undeleteLink: '/',
    title: subject({
      template: "team-deleted",
      teamName: "test-team",
    }),
  }
  response.render('team-deleted', testParams)
});


// email request handling 📮

async function render(path, params) {
  var template = await readFile(path, 'utf8');
  params.filename = path;
  return pug.render(template, params);
}

app.post("/email", async (request, response) => {
  const css = fs.readFileSync('./public/dist.css').toString();
  console.log('🌹', request.body && request.body.template, request.body)
  // set which view to render based on body.template
  let content = await render(`views/${request.body.template}.pug`, request.body);
  // juice automatically inlines styles onto html for use in emails
  const htmlMessage = juice.inlineContent(content, css);
  response.json({
    subject: subject(request.body),
    htmlMessage: htmlMessage,
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
