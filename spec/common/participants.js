// Retrieve the list of users for a working group as a sentence.
// APIKEY and GROUP can be specified via either enironment variable or argument
// usage:
//   APIKEY=<apikey> GROUP=wg/rdf-star node participants.js
// or
//   node participants.js <apikey> wg/rdf-star
// group defaults to wg/rdf-star


const https = require('https');
const process = require('process');

const APIKEY = process.env.APIKEY || process.argv[2] || '';
const GROUP = process.env.GROUP || process.argv[3] || "wg/rdf-star";

var apikey = APIKEY.length > 0 ? `&apikey=${APIKEY}` : ''

const groupOptions = {
  hostname: 'api.w3.org',
  path: `/groups/${GROUP}?items=50${apikey}`,
  headers: {
    'Accept': 'application/json'
  }
};

const userOptions = {
  hostname: 'api.w3.org',
  path: `/groups/${GROUP}/users?items=50${apikey}&former=true`,
  headers: {
    'Accept': 'application/json'
  }
};

https.get(groupOptions, (res) => {
  let groupData = '';
  let userData = '';

  res.on('data', (chunk) => {
    groupData += chunk;
  });

  res.on('end', () => {
    const groupName = JSON.parse(groupData).name;

    https.get(userOptions, (res) => {

      res.on('data', (chunk) => {
        userData += chunk;
      });

      res.on('end', () => {
        const users = JSON.parse(userData)._links.users.map(u => u.title);

        if (users.length === 1) {
          console.log(`The sole member of the ${groupName} Group was ${users[0]}.`);
        } else if (users.length === 2) {
          const joinedUsers = users.join(' and ');
          console.log(`Members of the ${groupName} Group included ${joinedUsers}.`);
        } else {
          // Find the maximum length of the first part (before the space)
          const maxLength = Math.max(...users.map(user => user.split(" ")[0].length));

          // Right-align the first component and format the strings
          const alignedUsers = users.map(user => {
            const [first, ...rest] = user.split(" ");
            return first.padStart(maxLength, " ") + " " + rest.join(" ");
          });
          const joinedUsers = alignedUsers.slice(0, -1).join(",\n");
          console.log(`Members of the ${groupName} Group included\n${joinedUsers}, and\n${alignedUsers[users.length - 1]}.`);
        }
      });
    }).on('error', (err) => {
      console.error(`Error: ${err.message}`);
    });
  });
}).on('error', (err) => {
  console.error(`Error: ${err.message}`);
});
