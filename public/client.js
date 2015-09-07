(function () {
  var apiDomain;

  if (document.domain === 'localhost') {
    apiDomain = 'http://localhost:8080';
  }

  // support staging
  if (document.domain === 'express-js-chat-demo-complete.herokuapp.com') {
    apiDomain = 'https://express-js-chat-demo-complete.herokuapp.com';
  }

  var chatClient = angular.module('simple-chat-client', []);
  chatClient.constant('API_DOMAIN', apiDomain);
  chatClient.constant('API_URL', apiDomain + '/api/v1');
  chatClient.constant('CREDENTIALS', {
    username: 'user',
    password: '123456'
  });

  chatClient.controller('MainCtrl', function($scope, $http, auth, API_URL, CREDENTIALS) {
    auth.login(CREDENTIALS.username, CREDENTIALS.password);

    $scope.rooms = [];
    $http.get(API_URL + '/rooms').then(function(response) {
      $scope.rooms = response.data;
    });
    $scope.select = function(room) {
      $scope.selectedRoom = room;
    };
  });

  chatClient.controller('RoomCtrl', function($scope, $http, API_URL, API_DOMAIN) {
    var socket = null;

    $scope.messages = [];
    $scope.roomId = null;
    $scope.newMessage = "";
    $scope.$parent.$watch('selectedRoom', function(value){
      $scope.roomId = value._id;
      $scope.getMessages();
      $scope.listen();
    });

    $scope.getMessages = function() {
      $http.get(API_URL + '/rooms/' + $scope.roomId + '/messages').then(function(response) {
        $scope.messages = response.data;
      });
    };

    $scope.postMessage = function() {
      $http.post(API_URL + '/rooms/' + $scope.roomId + '/messages', {
        text: $scope.newMessage
      }).then(function(response){
        $scope.newMessage = null;
      });
    };

    $scope.removeMessage = function(message) {
      $http.delete(API_URL + '/rooms/' + $scope.roomId + '/messages/' + message._id);
    };

    $scope.listen = function() {
      if(socket) {
        socket.disconnect();
      }
      console.log(API_DOMAIN)
      socket = io.connect(API_DOMAIN);
      socket.emit("subscribe", { room: $scope.roomId });
      socket.on('new message', function(message) {
        $scope.messages.unshift(message);
        $scope.$apply();
      });
      socket.on('message removed', function(data) {
        _.remove($scope.messages, function(message) {
          return message._id === data.messageId;
        });
        $scope.$apply();
      });
    }
  });
})();
