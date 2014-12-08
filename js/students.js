"use strict";


angular.module('PeerGrader', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'JzXjelfFGeUVJm5t5mPd8UaCt7OB7hIaIQk51o5p';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'SYbBvrOCTgVuVQMVmFCfYmAXswZvdHBdZd4XnjeJ';
    })
    .controller('ProjectsController', function($scope){
        var projectsUrl = 'https://api.parse.com/1/classes/';
        $scope.loading = true;
        $http.get(commentsUrl)
            .success(function (data) {
                $scope.comments = data.results;
                $scope.sortComments();
            })
            .error(function (err) {
                $scope.errorMessage = err;
            })
            .finally(function() {
                $scope.loading = false;
            });
        $scope.exists = function (projectAttribute) {
            return (null == projectAttribute);
        };
        $scope.groupMembers = [
            {
                "name": 'Morya Breland Jr.',
                "rating": 5
            },
            {
                "name": 'Jacob Koch',
                "rating": 5
            },
            {
                "name": 'Sean Allen',
                "rating": 5
        }];


        $scope.projects = [
            {
                "className": 'INFO 343',
                "professorName": 'Dr. Stearns',
                "name": 'Final Web Project',
                "group": $scope.groupMembers,
                "DueDate": new Date("12/4/2014"),
                "expand": false

            },
            {
                "className": 'INFO 340',
                "professorName": 'Shawn Walker',
                "name": 'Final Database Project',
                "DueDate": new Date("12/9/2014"),
                "expand": false
            },
            {
                "className": 'INFO 340',
                "professorName": 'David Senan',
                "name": 'Final Presentation',
                "DueDate": new Date("12/6/2014"),
                expand: false
        }];
    });