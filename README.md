# football-manager
With the help of our managing app, Team can be managed, players added, deleted or updated. And a view of the team’s formation is visible with the starters being shown in the field. 

Testing env:
https://main--resplendent-panda-166c49.netlify.app/

## Note
I assume image urls will not be changed while testing with new csv file (pealse test with the csv file attached in assignment). I have used player id from the image url as the unique id to find the record.

# Testing scenarios
1. User can upload the csv file with required details and click on the import.
2. If it is valid csv it will show the quick stats in the modal. Otherwise it will show the error.
3. User can search the player with name and posistion.
4. User can delete the player.
5. User can edit the player.
6. User can view the formation overview page if all the requirements are met.


# Additional details
1. Since user can search the player with each key stroke there is no need for the search text besside the search string.
2. Since some of the images are no loading, I have added default image if url throws an error.
3. For weight and height, user cannot submit negative integers.
4. Edit button in the modal will only be enabled when user name is changed or filled compeletly.
