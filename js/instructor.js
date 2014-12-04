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

    $('#logo').click(function() {
        $(".createActivity").hide();
        $(".viewActivity").hide();
        $(".mainActivity").show();
        $('#view').attr('class', 'nav-item');
        $('#create').attr('class', 'nav-item');
    });

    $('.view').click(function() {
        $(".createActivity").hide();
        $(".mainActivity").hide();
        $(".viewActivity").show();
        $('#view').attr('class', 'nav-item current');
        $('#create').attr('class', 'nav-item');
    });

    $('.create').click(function() {
        $(".viewActivity").hide();
        $(".mainActivity").hide();
        $(".createActivity").show();
        $('#view').attr('class', 'nav-item');
        $('#create').attr('class', 'nav-item current');
    });
});

angular.module('PeerReviewApp', [])
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
        var membersURL = 'https://api.parse.com/1/classes/members';
        var classes = [];
        $scope.users = [];
        $scope.members = [];

        $scope.showView = function() {

        };

        $scope.showCreate = function() {

        };

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
        	$http.get(membersURL)
                .success(function(responseData) {
                    $scope.users = responseData.results;
                    for (idx = 0; idx < $scope.users.length; ++idx) {
                    	classes.push($scope.users[idx].classNameX);
                    }
                    $scope.classesList = [];
                    $.each(classes, function (index, value) {
                           if($.inArray(value, $scope.classesList) === -1) $scope.classesList.push(value);
                    });

                    var newGroupForm = $('#newGroupForm');
					var classDropdown = $('#classSelectors');
					var classOption;
					var idx;
					//Fills in classes to the select box in new group form
					for (idx = 0; idx < $scope.classesList.length; ++idx) {
						classOption = document.createElement('option');
						classOption.innerHTML = $scope.classesList[idx];
						classOption.setAttribute("value", $scope.classesList[idx]);
                        classDropdown.append(classOption);
					}
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.loading = false;
                });
        }; //fillClassOptions()

        //call refreshGroups() to get the initial set of groups on page load for View Groups functionality
        $scope.refreshGroups();

        //call fillClassOptions to get the dropdown list for Create Groups functionality
        $scope.fillClassOptions();

        //fills groupMembers grid
           $('#classSelectors').bind('change', function() {
               $('#groupMembersGrid').fadeIn();
               $http.get(membersURL + '?where={"grouped": false, "classNameX": "' + $('#classSelectors').val() + '"}')
                   .success(function (data) {
                       $scope.members = data.results;
                   })
                   .error(function (err) {
                       console.log(err);
                   });
           });

               /*{
                  type: "GET",
                  url: membersURL + '?where',
                  headers: {
                      'X-Parse-Application-Id': 'JzXjelfFGeUVJm5t5mPd8UaCt7OB7hIaIQk51o5p',
                      'X-Parse-REST-API-Key': 'SYbBvrOCTgVuVQMVmFCfYmAXswZvdHBdZd4XnjeJ'
                  },
                  data: {
                      class : $('#classSelectors').val(),
                      grouped : false
                  },
                  //success logic creates table in html, can parse return the full table html or do we need to make it
                  //with specific values from a returned array?
                   success: function(resultsArray) {
                    $scope.members = resultsArray;
                  }*/

        //initialize a new group object on the scope for the new group form
        $scope.newGroup = '';
       // $scope.newGroup.members = '';

        $scope.addGroup = function(group) {
            $scope.inserting = true;
            var index = 0;
            var checkedArray = [];
            //create array of checked values
            $("#groupMembersGrid input:checkbox:checked").each(function(){ checkedArray.push(" " + this.className); });
            console.log(checkedArray);
            //for number of checked, put into array
            $scope.newGroup.members = checkedArray.toString();
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

[x]  create algorithm to get all classes that users are in and push them into classes array without duplicates

[x]  fill a table with users based off them being in the class selected and not being in a group
	[x] - make individual users in that table have a checkbox where multiple can be selected for group creation

[x]  make add group button call addGroup function

[x]  make view groups page work
	[] - group rows clickable to pop up with their peer-review grades?
	[] - color coded based on whether or not they have submitted peer-review grades?


*/