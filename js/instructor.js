"use strict"

$(document).ready(function() {
	//on Create Groups click
    $('.activityCreate').click(function() {
        //slides in top left options
        setTimeout(function() {
        	$(".sidebar").show('slide', {direction: 'left'}, 1000);
        }, 500);

        //create groups display
        $(".activitySelectWrapper").hide('blind');
        $(".viewActivity").fadeOut();
        $(".createActivity").delay(400).fadeIn();
    });

    //on View Groups click
    $('.activityView').click(function() {
    	//slides in top left options
        setTimeout(function() {
        	$(".sidebar").show('slide', {direction: 'left'}, 1000);
        }, 500);

        //view groups display
        $(".activitySelectWrapper").hide('blind');
        $(".createActivity").fadeOut();
        $(".viewActivity").delay(400).fadeIn();
    });
});

angular.module('PeerReviewApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'JzXjelfFGeUVJm5t5mPd8UaCt7OB7hIaIQk51o5p';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'SYbBvrOCTgVuVQMVmFCfYmAXswZvdHBdZd4XnjeJ';
    })

    .controller('GroupsController', function($scope, $http) {
        //this is the base URL for all group objects managed by your application
        //requesting this with a GET will get all groups objects
        //sending a POST to this will insert a new group object
        //sending a PUT to this URL + '/' + group.objectId will update an existing group
        //sending a DELETE to this URL + '/' + group.objectId will delete an existing group
        var groupsURL = 'https://api.parse.com/1/classes/groups';
        var usersURL = 'https://api.parse.com/1/classes/users';
        var classes = [];

        $scope.refreshGroups = function() {
            $scope.loading = true;
            $http.get(groupsURL)
                .success(function(responseData) {
                    $scope.groups = responseData.results;
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.loading = false;
                });
        }; //$scope.refreshGroups()

        $scope.fillClassOptions = function () {
        	$scope.loading = true;
        	$http.get(usersURL)
                .success(function(responseData) {
                    //NEEDS REVISION, FILLS CLASS ARRAY WITH LIST OF CLASSES BY STUDENTS
                    $scope.users = responseData.results;
                    for (idx = 0; idx < $scope.users.length; ++idx) {
                    	classes.push(users[idx].className);
                    }


                    var newGroupForm = $('#newGroupForm');
					var classDropdown = newGroupForm.elements['class'];
					var classOption;
					var idx;
					//Fills in classes to the select box in new group form
					for (idx = 0; idx < classes.length; ++idx) {
						classOption = document.createElement('option');
						classOption.innerHTML = classes[idx];
						classOption.setAttribute("value", classes[idx]);
						classDropdown.appendChild(classOption);
					}
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.loading = false;
                });
        }
        //call refreshgroups() to get the initial set of groups on page load
        $scope.refreshGroups();

        //initialize a new group object on the scope for the new group form
        $scope.newGroup = null;

        $scope.addGroup = function(group) {
            $scope.inserting = true;
            $http.post(groupsURL, group)
                .success(function(responseData) {
                    //Parse will return the new objectId in the response data
                    //copy that to the group we just inserted
                    group.objectId = responseData.objectId;

                    //and add that group to our group list
                    $scope.groups.push(group);

                    //reset newgroup to clear the form
                    $scope.newGroup = null;
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.inserting = false;
                });
        };

        //function to update an existing group
        $scope.updateGroup = function(group) {
            $scope.updating = true;
            $http.put(groupsURL + '/' + group.objectId, group)
                .success(function(responseData) {
                    //nothing we really need to do since local object is already up-to-date
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.updating = false;
                });
        }; //ends update group

    });

/* To do:

create algorithm to get all classes that users are in and push them into classes array without duplicates

fill a table with users based off them being in the class selected and not being in a group
	- make individual users in that table have a checkbox where they can be mass selected

make add group button call addGroup function

make view groups page work
	- group rows clickable to pop up with their peer-review grades?
	- color coded based on whether or not they have submitted peer-review grades?


*/