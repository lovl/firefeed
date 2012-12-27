{
  "rules": {
    // All data is readable by anyone.
    ".read": true,
    "people": {
      // A list of users with their names on the site.
      "$userid": {
        // Only the user can write their own entry into this list.
        ".write": "$userid == auth.id"
      }
    },
    "users": {
      "$userid": {
        // The user is allowed to write everything in their bucket.
        ".write": "$userid == auth.id",
        "following": {
          // The following list should only contain actual ids from the "people" list. 
          "$followingid": {
            ".validate": "root.child('people').hasChild($followingid)"
          }
        },
        "followers": {
          // Anyone can add themself to to this user's followers list.
          "$followerid": {
            ".write": "$followerid == auth.id"
          }
        },
        "feed": {
          "$sparkid": {
            // User A can write in user B's feed, but only if A is following B, and only for sparks for which they are the author.
            ".write": "root.child('users/' + $userid + '/following').hasChild(auth.id) && root.child('sparks/' + $sparkid + '/author').val() == auth.id"
          }
        }
      }
    },
    "sparks": {
      // A global list of sparks (the "firehose").
      "$sparkid": {
        // Modifying an existing spark is not allowed.
        ".write": "!data.exists()",
        // Every spark should have an author and a body.
        ".validate": "newData.hasChildren(['author', 'content'])",
        // A user can attribute a spark only to themselves.
        "author": {
          ".validate": "newData.val() == auth.id"
        },
        "content": {
          ".validate": "newData.isString()"
        }
      }
    },
    "recent-users": {
      // Users can add themselves to the list of users with recent activity.
      "$userid": {
        ".write": "$userid == auth.id"
      }
    },
    "recent-sparks": {
      // Authors of sparks can add their sparks to this list.
      "$sparkid": {
        ".write": "root.child('sparks/' + $sparkid + '/author').val() == auth.id"
      }
    }
  }
}
