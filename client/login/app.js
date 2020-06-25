var app = angular.module('myApp', ['ngMaterial', 'ngMessages']);

app.controller('MainCtrl', function($scope, $timeout) {
  $scope.loginModel = {
    username: '',
    password: ''
  };

})
.directive('myUid', function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attr, mCtrl){
            mCtrl.$parsers.push(function(value){
                if(value.length == 9){
                    var aryValue = value.split("");
                    var sum = 0;

                    for(var i=0;i<8;i++){
                        if (!Number.isInteger(parseInt(aryValue[i]))){
                            mCtrl.$setValidity('uid', false);
                            return value;
                        }
                        sum += parseInt(aryValue[i]);
                    }
                    if (!Number.isInteger(parseInt(aryValue[8]))){
                        mCtrl.$setValidity('uid', false);
                        return value;
                    }
                    if (aryValue[8] != (sum%10)){
                        mCtrl.$setValidity('uid', false);
                        return value;
                    }

                    mCtrl.$setValidity('uid', true);
                }else {
                    mCtrl.$setValidity('uid', false);
                }
                return value;
            });
        }
    };
})
.directive('myPassword', function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attr, mCtrl){
            mCtrl.$parsers.push(function(value){
                var aryValue = value.split("");
                var isChar = false, isDigit = false;

                aryValue.forEach(function(element, index, array){
                    if (Number.isInteger(parseInt(element))){
                        isDigit = true;
                    }else{
                        isChar = true;
                    }
                })

                mCtrl.$setValidity('pass', isDigit && isChar);

                return value;
            });
        }
    };
})
.directive('compareTo', function(){
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel){
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
})
.controller('mainController',function($scope){
    $scope.user = {
        id : "",
        name:"",
        email:"",
        password:"",
        verifyPassword:""
    };
})
;
